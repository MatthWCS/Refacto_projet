import { Hero } from "./hero/Hero.js";
import { HeroFactory } from "./HeroFactory.js";

import { HeroEngine } from "./hero/HeroEngine.js";
import { InventoryEngine } from "./hero/InventoryEngine.js";
import { ConditionEngine } from "./hero/ConditionEngine.js";
import { EffectEngine } from "./hero/EffectEngine.js";
import { StateEngine } from "./hero/StateEngine.js";
import { CombatEngine } from "./CombatEngine.js";
import { ParagraphEngine } from "./ParagraphEngine.js";
import { TradeEngine } from "./TradeEngine.js";
import { SaveService } from "./SaveService.js";

import { ParagraphModel } from "../models/ParagraphModel.js";
import { ItemModel } from "../models/ItemModel.js";
import { StateModel } from "../models/StateModel.js";

import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// GameEngine
// Responsabilité : orchestration globale du jeu
//   (initialisation, navigation, items, sauvegarde)
// -------------------------------------------------------
export class GameEngine {

    /**
     * @param {object}   options
     * @param {object}   options.ui            - Couche d'affichage (ConsoleUI ou autre)
     * @param {number}   [options.adventureId]
     * @param {Logger}   [options.logger]
     * @param {Function} [options.onBeforeStart]
     *   Hook async appelé après _initEngines() mais AVANT goToParagraph().
     *   Reçoit le GameEngine en paramètre.
     *   Permet d'injecter le CombatUI interactif ou de créer le héros
     *   de façon interactive sans monkey-patching extérieur.
     */
    constructor({
        ui,
        adventureId = 1,
        logger = new Logger(LogLevel.INFO, "[GameEngine]"),
        onBeforeStart = null,
        saveService = null        // injecté depuis l'extérieur ; défaut = SaveService HTTP
    } = {}) {
        this.ui = ui;
        this.adventureId = adventureId;
        this.logger = logger;
        this.onBeforeStart = onBeforeStart;

        this.hero = null;
        this.heroEngine = null;
        this.conditionEngine = null;
        this.stateEngine = null;
        this.effectEngine = null;
        this.inventoryEngine = null;
        this.combatEngine = null;
        this.tradeEngine = null;
        this.paragraphEngine = null;
        this.saveService = saveService ?? new SaveService(adventureId, logger);

        this.currentParagraphId = null;
        this.isGameOver = false;
    }

    // -------------------------------------------------------
    // 1. INITIALISATION DES ENGINES
    // -------------------------------------------------------

    async _initEngines() {

        const [itemDefinitions, stateDefinitions] = await Promise.all([
            ItemModel.getAll(),
            StateModel.getAll()
        ]);

        this.heroEngine = new HeroEngine(this.hero, this.logger);

        this.conditionEngine = new ConditionEngine(
            this.heroEngine,
            this.logger
        );

        this.stateEngine = new StateEngine(
            this.heroEngine,
            this.conditionEngine,
            stateDefinitions,
            this.logger
        );

        this.effectEngine = new EffectEngine(
            this.heroEngine,
            this.conditionEngine,
            this.stateEngine,
            this.logger
        );

        this.inventoryEngine = new InventoryEngine(
            this.heroEngine,
            this.effectEngine,
            this.conditionEngine,
            this.stateEngine,
            itemDefinitions
        );

        this.combatEngine = new CombatEngine(
            this.heroEngine,
            this.stateEngine,
            this.logger
        );

        this.tradeEngine = new TradeEngine(
            this.heroEngine,
            this.inventoryEngine,
            this.logger
        );

        this.paragraphEngine = new ParagraphEngine({
            paragraphModel: ParagraphModel,
            heroEngine: this.heroEngine,
            inventoryEngine: this.inventoryEngine,
            effectEngine: this.effectEngine,
            conditionEngine: this.conditionEngine,
            stateEngine: this.stateEngine,
            combatEngine: this.combatEngine,
            logger: this.logger
        });

        this.logger.info("Engines initialisés.");
    }

    // -------------------------------------------------------
    // 2. DÉMARRAGE
    // -------------------------------------------------------

    /** @param {number} [startParagraphId]  @param {string} [slot] */
    async start(startParagraphId = 0, slot = "autosave") {

        const save = await this.saveService.load(slot);
        this.hero = save ? new Hero(save.hero) : HeroFactory.createNewHero("Héros");
        this.activeSlot = slot;

        await this._initEngines();

        // Hook pré-navigation : injection CombatUI, création interactive, etc.
        if (this.onBeforeStart) {
            await this.onBeforeStart(this);
        }

        const paragraphId = save?.current_paragraph_id ?? startParagraphId;
        this.logger.info(`Démarrage — paragraphe ${paragraphId}, slot "${slot}"`);

        await this.goToParagraph(paragraphId);
    }

    // -------------------------------------------------------
    // 3. NAVIGATION
    // -------------------------------------------------------

    /** @param {number} paragraphId */
    async goToParagraph(paragraphId) {

        if (this.isGameOver) return;

        const result = await this.paragraphEngine.resolveParagraph(paragraphId);

        // Game Over (mort en combat)
        if (result.gameOver) {
            this.isGameOver = true;
            if (result.log) this.ui.renderCombatResult?.(result);
            this.ui.renderGameOver(this.heroEngine.hero);
            return;
        }

        // Fin de l'aventure (succès ou échec narratif)
        if (result.ending) {
            await this._handleEnding(result);
            return;
        }

        // Paragraphe intermédiaire (test ou combat) :
        //   — on affiche toujours son texte
        //   — on affiche le résumé de combat s'il y en a un
        //   — on traite les items trouvés (ex: butin après combat)
        //   — puis on suit la redirection
        if (result.next) {
            if (result.content) {
                this.ui.renderParagraph(result, this.heroEngine.hero);
                await this.ui.waitForInput?.();
            }
            if (result.testResult) {
                this.ui.renderTestResult?.(result.testResult);
                await this.ui.waitForInput?.();
            }
            // Tests pré-combat (§34, §70) — affichés avant le résumé de combat
            if (result.preCombatResults?.length) {
                for (const pcResult of result.preCombatResults) {
                    this.ui.renderTestResult?.(pcResult);
                    await this.ui.waitForInput?.();
                }
            }
            if (result.log) {
                this.ui.renderCombatResult?.(result);
            }
            // Items du paragraphe intermédiaire (butin de combat, etc.)
            if (result.items?.length && this.ui.handleItemPickup) {
                const context = { inCombat: false, surprised: false };
                for (const item of result.items) {
                    const pickup = await this.ui.handleItemPickup(item, this.inventoryEngine, context);
                    if (pickup?.goto) {
                        await this.goToParagraph(pickup.goto);
                        return;
                    }
                }
            }
            await this.goToParagraph(result.next);
            return;
        }

        // Mise à jour de l'ID courant AVANT la sauvegarde
        this.currentParagraphId = paragraphId;

        // Décrément de l'Ivresse tous les 5 paragraphes narratifs
        this._tickDrunkness();

        await this.saveService.save(
            this.heroEngine.hero.serialize(),
            this.currentParagraphId
        );

        this.ui.renderParagraph(result, this.heroEngine.hero);

        // Vérification endurance après effets du paragraphe
        if (this.heroEngine.hero.endurance <= 0) {
            this.isGameOver = true;
            this.ui.renderGameOver(this.heroEngine.hero);
            return;
        }

        // Test à effets sans combat (§70) — affiché après le texte du paragraphe
        if (result.effectTestResults?.length) {
            for (const testResult of result.effectTestResults) {
                this.ui.renderTestResult?.(testResult);
                await this.ui.waitForInput?.();
            }
            // Afficher la seconde partie du texte si elle existe
            if (result.content_after) {
                this.ui.renderContentAfter?.(result.content_after, this.heroEngine.hero);
            }
            // Vérification endurance après effets du test
            if (this.heroEngine.hero.endurance <= 0) {
                this.isGameOver = true;
                this.ui.renderGameOver(this.heroEngine.hero);
                return;
            }
        }

        // Items du paragraphe — affichés APRÈS le texte du paragraphe
        if (result.items?.length && this.ui.handleItemPickup) {
            const context = {
                inCombat: false,
                surprised: this.stateEngine.hasState(9)
            };
            for (const item of result.items) {
                await this.ui.handleItemPickup(item, this.inventoryEngine, context);
                // Vérifier si le héros est mort suite à l'utilisation d'un item
                if (this.heroEngine.hero.endurance <= 0) {
                    this.isGameOver = true;
                    this.ui.renderGameOver(this.heroEngine.hero);
                    return;
                }
            }
        }

        if (!result.choices?.length) {
            this.ui.renderNoChoices();
            return;
        }

        this.ui.renderChoices(result.choices, async (choice) => {
            await this.handleChoice(choice);
        });
    }

    // -------------------------------------------------------
    // 3b. FIN DE L'AVENTURE
    // -------------------------------------------------------

    /** @private */
    async _handleEnding(result) {
        // Afficher le contenu du paragraphe de fin
        this.ui.renderParagraph(result, this.heroEngine.hero);

        // Items éventuels (rare mais possible)
        if (result.items?.length && this.ui.handleItemPickup) {
            for (const item of result.items) {
                await this.ui.handleItemPickup(item, this.inventoryEngine, {});
            }
        }

        // Afficher le message de fin
        this.ui.renderEnding(result.endingType);

        // Sauvegarder l'état final
        this.currentParagraphId = result.paragraphId;
        await this.saveService.save(
            this.heroEngine.hero.serialize(),
            this.currentParagraphId
        );

        // Proposer rejouer ou quitter
        const choice = await this.ui.askEndingChoice();

        if (choice === "replay") {
            // Effacer la sauvegarde et relancer depuis le début
            await this.saveService.clear?.();
            await this.start(0);
        } else {
            // Quitter
            this.ui.close?.();
        }
    }

    // -------------------------------------------------------
    // 3c. IVRESSE — décrément tous les 5 paragraphes narratifs
    // -------------------------------------------------------

    /** @private */
    _tickDrunkness() {
        const hero = this.heroEngine.hero;
        if (hero.drunkness <= 0) return;

        // Defensive init — l'ancienne sauvegarde peut ne pas avoir ce champ
        if (typeof hero.paragraphsSinceDrunkDecrement !== "number"
            || isNaN(hero.paragraphsSinceDrunkDecrement)) {
            hero.paragraphsSinceDrunkDecrement = 0;
        }

        hero.paragraphsSinceDrunkDecrement += 1;

        if (hero.paragraphsSinceDrunkDecrement >= 5) {
            hero.paragraphsSinceDrunkDecrement = 0;
            this.heroEngine.modifyAttribute("drunkness", "subtract", 1);
            this.logger.info(
                `Ivresse diminue → ${hero.drunkness} ` +
                `(malus DEX : -${this.heroEngine.getDrunknessPenalty()})`
            );
        } else {
            this.logger.debug(
                `Paragraphes depuis dernier décrément Ivresse : ` +
                `${hero.paragraphsSinceDrunkDecrement}/5`
            );
        }
    }

    // -------------------------------------------------------
    // 4. CHOIX
    // -------------------------------------------------------

    /** @param {object} choice */
    async handleChoice(choice) {

        if (this.isGameOver) return;

        const nextId = choice.target_paragraph_id;

        if (!nextId) {
            this.ui.renderError("Choix sans paragraphe cible.");
            this.logger.warn("handleChoice : target_paragraph_id manquant", choice);
            return;
        }

        await this.goToParagraph(nextId);
    }
}