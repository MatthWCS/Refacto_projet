import { Dice }   from "./Dice.js";
import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// Constantes — IDs métier isolés ici pour traçabilité
// -------------------------------------------------------
const STATE_ID_SURPRISED = 9;   // état "surpris" en BDD
const STATE_ID_COMBAT    = 1;   // état "en combat" en BDD

// -------------------------------------------------------
// ParagraphEngine
// Responsabilité : résolution complète d'un paragraphe
//   (effets, tests, combats, choix filtrés)
// -------------------------------------------------------
export class ParagraphEngine {

    /**
     * @param {object} deps
     * @param {object} deps.paragraphModel  - Fournit getParagraphData() avec encounters déjà jointé
     * @param {HeroEngine}      deps.heroEngine
     * @param {InventoryEngine} deps.inventoryEngine
     * @param {EffectEngine}    deps.effectEngine
     * @param {ConditionEngine} deps.conditionEngine
     * @param {StateEngine}     deps.stateEngine
     * @param {CombatEngine}    deps.combatEngine
     * @param {Logger}          [deps.logger]
     */
    constructor({
                    paragraphModel,
                    heroEngine,
                    inventoryEngine,
                    effectEngine,
                    conditionEngine,
                    stateEngine,
                    combatEngine,
                    logger = new Logger(LogLevel.INFO, "[ParagraphEngine]")
                }) {
        this.paragraphModel  = paragraphModel;
        this.heroEngine      = heroEngine;
        this.inventoryEngine = inventoryEngine;
        this.effectEngine    = effectEngine;
        this.conditionEngine = conditionEngine;
        this.stateEngine     = stateEngine;
        this.combatEngine    = combatEngine;
        this.logger          = logger;
    }

    // -------------------------------------------------------
    // Résolution complète d'un paragraphe
    // -------------------------------------------------------

    /**
     * Point d'entrée principal.
     * Récursif (via tests) — visitedIds protège contre les boucles.
     *
     * @param {number}  paragraphId
     * @param {Set}     [visitedIds]
     * @returns {Promise<ParagraphResult>}
     */
    async resolveParagraph(paragraphId, visitedIds = new Set()) {

        if (visitedIds.has(paragraphId)) {
            this.logger.warn(`Boucle détectée sur le paragraphe ${paragraphId}`);
            return { content: "Erreur : boucle détectée.", choices: [], items: [], effects: [] };
        }
        visitedIds.add(paragraphId);

        const data = await this.paragraphModel.getParagraphData(paragraphId);
        const { content, choices, tests, items, effects, encounters, is_surprised } = data;

        this.logger.debug(`Résolution paragraphe ${paragraphId}`);

        // 1. État "surpris"
        if (is_surprised) {
            this.stateEngine.addState(STATE_ID_SURPRISED);
        }

        // 2. Cycle des états (buff/debuff, durées, conditions de retrait)
        this.stateEngine.applyStateCycle();

        // 3. Effets du paragraphe
        this.effectEngine.applyEffects(effects);

        // 4. Test → on retourne le contenu du paragraphe de test + next
        //    GameEngine affichera le texte PUIS suivra la redirection
        if (tests.length > 0) {
            const testResult = await this._resolveTest(tests[0]);
            return {
                paragraphId,
                content,
                items,
                effects,
                choices:    [],
                next:       testResult.next,
                testResult              // embarqué pour affichage par l'UI
            };
        }

        // 5. Combat
        if (encounters.length > 0) {
            return this._resolveCombatParagraph(content, encounters, items, paragraphId);
        }

        // 6. Choix filtrés par conditions
        return {
            paragraphId,
            content,
            choices: this._filterChoices(choices),
            items,
            effects
        };
    }

    // -------------------------------------------------------
    // Tests
    // -------------------------------------------------------

    /**
     * @private
     * @param {object} test
     * @returns {Promise<number>} ID du paragraphe suivant
     */
    async _resolveTest(test) {
        const hero      = this.heroEngine.hero;
        const diceCount = test.dice_count ?? 2;

        // ── Chance ──────────────────────────────────────────────
        if (test.attribute === "chance") {
            const { success, roll } = Dice.testLuck(hero);
            const thresholdBefore   = hero.luck;            // avant décrément
            this.heroEngine.modifyAttribute("luck", "subtract", 1);
            this.logger.debug(`Test Chance : jet ${roll} ≤ ${thresholdBefore} → ${success ? "succès" : "échec"}`);
            return {
                attribute: "chance",
                roll,
                threshold: thresholdBefore,
                success,
                next: success ? test.success_paragraph_id : test.failure_paragraph_id
            };
        }

        // ── Parité ──────────────────────────────────────────────
        if (test.attribute === "parity") {
            const { isEven, roll } = Dice.testParity();
            this.logger.debug(`Test Parité : jet ${roll} → ${isEven ? "pair" : "impair"}`);
            return {
                attribute: "parity",
                roll,
                threshold: null,
                success:   isEven,
                next: isEven ? test.success_paragraph_id : test.failure_paragraph_id
            };
        }

        // ── Random (jet brut, pas de seuil héros) ───────────────
        // §80 : lancer 1D6, résultat impair → §2, pair → §97
        // On réutilise parity mais avec le label "random"
        if (test.attribute === "random") {
            const roll    = diceCount === 1 ? Dice.roll1D6() : Dice.roll2D6();
            const isEven  = roll % 2 === 0;
            this.logger.debug(`Test Random : jet ${roll} → ${isEven ? "pair" : "impair"}`);
            return {
                attribute: "random",
                roll,
                threshold: null,
                success:   isEven,
                next: isEven ? test.success_paragraph_id : test.failure_paragraph_id
            };
        }

        // ── Attribut générique (dexterity, drunkness, etc.) ─────
        const roll = diceCount === 1 ? Dice.roll1D6() : Dice.roll2D6();

        let threshold = hero[test.attribute] ?? 0;

        // Malus Ivresse sur les tests de DEX uniquement
        if (test.attribute === "dexterity") {
            const penalty = this.heroEngine.getDrunknessPenalty();
            if (penalty > 0) {
                threshold -= penalty;
                this.logger.debug(`Test DEX — malus Ivresse : -${penalty} → seuil ${threshold}`);
            }
        }

        const success = roll <= threshold;
        this.logger.debug(`Test ${test.attribute} (${diceCount}D6) : jet ${roll} ≤ ${threshold} → ${success ? "succès" : "échec"}`);

        return {
            attribute: test.attribute,
            diceCount,
            roll,
            threshold,
            success,
            next: success ? test.success_paragraph_id : test.failure_paragraph_id
        };
    }

    // -------------------------------------------------------
    // Combat
    // -------------------------------------------------------

    /**
     * @private
     * Charge les monstres, lance le combat, retourne le résultat formaté.
     */
    async _resolveCombatParagraph(content, encounters, items, paragraphId) {

        const monsters = this._loadMonsters(encounters);
        const rules    = encounters.flatMap(e => e.rules ?? []);

        this.logger.debug(`Combat — ${monsters.length} monstre(s), ${rules.length} règle(s)`);

        const combatResult = await this.combatEngine.fight(monsters, rules);

        this.stateEngine.removeState(STATE_ID_COMBAT);

        // Mort du héros
        if (combatResult.outcome === "hero_dead") {
            return {
                paragraphId,
                content,
                items:    [],
                log:      combatResult.log,
                outcome:  combatResult.outcome,
                gameOver: true,
                choices:  []
            };
        }

        // Fuite
        if (combatResult.outcome === "fled") {
            const next = encounters[0].paragraph_flee ?? null;
            if (!next) throw new Error(`Combat (§${paragraphId}) : paragraph_flee non défini`);
            return {
                paragraphId,
                content,
                items:   [],
                log:     combatResult.log,
                outcome: combatResult.outcome,
                next
            };
        }

        // Victoire
        const next = encounters[0].paragraph_victory ?? null;
        if (!next) throw new Error(`Combat (§${paragraphId}) : paragraph_victory non défini`);
        if (next === paragraphId) throw new Error(`Combat (§${paragraphId}) : paragraph_victory renvoie vers lui-même`);

        return {
            paragraphId,
            content,
            items,                     // butin récupéré après victoire
            log:             combatResult.log,
            outcome:         combatResult.outcome,
            next,
            monsters,
            currentHeroDex:  combatResult.finalDexterity,
            currentHeroEnd:  combatResult.finalEndurance
        };
    }

    /**
     * @private
     * Construit les objets monstre depuis les encounters.
     *
     * ParagraphModel.getEncounters() fait déjà le JOIN sur character
     * et expose character_name, character_type, character_dexterity,
     * character_endurance — pas besoin de re-fetcher le character.
     *
     * Les stats de combat (dexterity, endurance) viennent de l'encounter
     * (permettant des overrides par rapport aux stats de base du character).
     */
    _loadMonsters(encounters) {
        return encounters.map(e => ({
            id:               e.character_id,
            name:             e.character_name,
            dexterity:        e.dexterity ?? e.character_dexterity,
            endurance:        e.endurance ?? e.character_endurance,
            character_type:   e.character_type,
            // target initial depuis la BDD — sera éventuellement surchargé
            // par les règles multi_enemy_behavior dans applyPreCombatRules
            target:           e.character_target ?? (e.character_type === "ally" ? "other_enemy" : "hero"),
            rules:            e.rules ?? []
        }));
    }

    // -------------------------------------------------------
    // Choix
    // -------------------------------------------------------

    /**
     * @private
     * Filtre les choix dont les conditions ne sont pas remplies.
     */
    _filterChoices(choices) {
        return choices.filter(choice => {
            if (!choice.conditions?.length) return true;
            return this.conditionEngine.evaluateAllSQL(choice.conditions);
        });
    }
}