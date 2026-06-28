import { Dice } from "./Dice.js";
import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// Constantes — IDs métier isolés ici pour traçabilité
// -------------------------------------------------------
const STATE_ID_SURPRISED = 9;   // état "surpris" en BDD
const STATE_ID_COMBAT = 1;   // état "en combat" en BDD

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
        this.paragraphModel = paragraphModel;
        this.heroEngine = heroEngine;
        this.inventoryEngine = inventoryEngine;
        this.effectEngine = effectEngine;
        this.conditionEngine = conditionEngine;
        this.stateEngine = stateEngine;
        this.combatEngine = combatEngine;
        this.logger = logger;
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
        const { content, choices, tests, items, effects, encounters, is_surprised, is_ending, ending_type, content_after } = data;

        this.logger.debug(`Résolution paragraphe ${paragraphId}`);

        // 0. Paragraphe de fin — effets appliqués mais pas de navigation
        if (is_ending) {
            this.effectEngine.applyEffects(effects);
            this.logger.info(`Fin de l'aventure — type : ${ending_type}`);
            return {
                paragraphId,
                content,
                items,
                effects,
                choices: [],
                ending: true,
                endingType: ending_type   // "success" | "failure"
            };
        }

        // 1. État "surpris"
        if (is_surprised) {
            this.stateEngine.addState(STATE_ID_SURPRISED);
        }

        // 2. Cycle des états (buff/debuff, durées, conditions de retrait)
        this.stateEngine.applyStateCycle();

        // 3. Effets du paragraphe
        this.effectEngine.applyEffects(effects);

        // 4. Tests normaux → redirection
        //    Tests pré-combat → résolus avant le combat ou comme test à effets
        const normalTests = tests.filter(t => !t.pre_combat);
        const preCombatTests = tests.filter(t => t.pre_combat == 1);

        if (normalTests.length > 0) {
            const testResult = await this._resolveTest(normalTests[0]);
            return {
                paragraphId,
                content,
                items,
                effects,
                choices: [],
                next: testResult.next,
                testResult
            };
        }

        // 4b. Test à effets sans combat (§70) — pre_combat sans encounter
        //     Applique les effets conditionnels puis affiche les choix normalement
        if (preCombatTests.length > 0 && encounters.length === 0) {
            const effectTestResults = [];
            for (const test of preCombatTests) {
                const testResult = await this._resolvePreCombatTest(test);
                effectTestResults.push(testResult);
            }
            return {
                paragraphId,
                content,
                content_after: content_after ?? null,
                items,
                effects,
                choices: this._filterChoices(choices),
                effectTestResults
            };
        }

        // 5. Combat (avec éventuels tests pré-combat §34)
        if (encounters.length > 0) {
            const preCombatResults = [];
            for (const test of preCombatTests) {
                const testResult = await this._resolvePreCombatTest(test);
                preCombatResults.push(testResult);
            }
            // Suspendre avant le combat si le paragraphe
            // a du contenu narratif
            if (content && this.onBeforeCombat) {
                await this.onBeforeCombat({ paragraphId, content });
            }

            return this._resolveCombatParagraph(content, encounters, items, paragraphId, preCombatResults);
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
        const hero = this.heroEngine.hero;
        const diceCount = test.dice_count ?? 2;

        // ── Luck Loop (§54) ─────────────────────────────────────
        // Boucle jusqu'à réussite ou perte de floor(END_départ/2)
        if (test.attribute === "luck_loop") {
            const endStart = this.heroEngine.hero.endurance;
            const maxLoss = Math.floor(endStart / 2);
            let totalLoss = 0;
            let success = false;
            let lastRoll = 0;
            let attempts = 0;

            while (!success && totalLoss < maxLoss) {
                const { success: s, roll } = Dice.testLuck(this.heroEngine.hero);
                const thresholdBefore = this.heroEngine.hero.luck;
                this.heroEngine.modifyAttribute("luck", "subtract", 1);
                lastRoll = roll;
                attempts++;
                this.logger.debug(`Luck loop tentative ${attempts} : jet ${roll} ≤ ${thresholdBefore} → ${s ? "succès" : "échec"}`);

                if (s) {
                    success = true;
                } else {
                    this.heroEngine.modifyAttribute("endurance", "subtract", 1);
                    totalLoss++;
                }
            }

            this.logger.info(`Luck loop terminée : ${attempts} tentative(s), ${totalLoss} END perdu(s)`);
            return {
                attribute: "luck_loop",
                roll: lastRoll,
                threshold: this.heroEngine.hero.luck + 1,
                success: true,    // toujours §57 dans les deux cas
                totalLoss,
                attempts,
                next: test.success_paragraph_id   // §57 dans les deux cas
            };
        }

        // ── Chance ──────────────────────────────────────────────
        if (test.attribute === "chance") {
            const { success, roll } = Dice.testLuck(hero);
            const thresholdBefore = hero.luck;            // avant décrément
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
                success: isEven,
                next: isEven ? test.success_paragraph_id : test.failure_paragraph_id
            };
        }

        // ── Random (jet brut, pas de seuil héros) ───────────────
        // §80 : lancer 1D6, résultat impair → §2, pair → §97
        // On réutilise parity mais avec le label "random"
        if (test.attribute === "random") {
            const roll = diceCount === 1 ? Dice.roll1D6() : Dice.roll2D6();
            const isEven = roll % 2 === 0;
            this.logger.debug(`Test Random : jet ${roll} → ${isEven ? "pair" : "impair"}`);
            return {
                attribute: "random",
                roll,
                threshold: null,
                success: isEven,
                next: isEven ? test.success_paragraph_id : test.failure_paragraph_id
            };
        }

        // ── Attribut générique (dexterity, drunkness, etc.) ─────
        const roll = diceCount === 1 ? Dice.roll1D6() : Dice.roll2D6();
        const modifier = test.modifier ?? 0;
        const total = roll + modifier;

        let threshold = hero[test.attribute] ?? 0;

        // Malus Ivresse sur les tests de DEX uniquement
        if (test.attribute === "dexterity") {
            const penalty = this.heroEngine.getDrunknessPenalty();
            if (penalty > 0) {
                threshold -= penalty;
                this.logger.debug(`Test DEX — malus Ivresse : -${penalty} → seuil ${threshold}`);
            }
        }

        const success = total <= threshold;
        this.logger.debug(
            modifier !== 0
                ? `Test ${test.attribute} (${diceCount}D6+${modifier}) : jet ${roll}+${modifier}=${total} ≤ ${threshold} → ${success ? "succès" : "échec"}`
                : `Test ${test.attribute} (${diceCount}D6) : jet ${roll} ≤ ${threshold} → ${success ? "succès" : "échec"}`
        );

        return {
            attribute: test.attribute,
            diceCount,
            modifier,
            roll,
            total,
            threshold,
            success,
            next: success ? test.success_paragraph_id : test.failure_paragraph_id
        };
    }

    // -------------------------------------------------------
    // Tests pré-combat (§34, §70)
    // -------------------------------------------------------

    /**
     * Résout un test pré-combat et applique les effets conditionnels.
     * §34 : malchanceux → -2 END avant combat
     * §70 : chanceux → -2 END, malchanceux → -4 END -1 DEX
     *
     * Les effets sont définis dans les colonnes success/failure de dice_test
     * via un champ effects_on_success / effects_on_failure en JSON,
     * ou via la table effect liée au test. Pour l'instant on les gère
     * directement depuis rule_value du test (champs embarqués).
     *
     * @private
     * @param {object} test
     * @returns {Promise<object>} testResult avec effets appliqués
     */
    async _resolvePreCombatTest(test) {
        const hero = this.heroEngine.hero;
        const { success, roll } = Dice.testLuck(hero);
        const thresholdBefore = hero.luck;
        this.heroEngine.modifyAttribute("luck", "subtract", 1);

        this.logger.debug(`Test pré-combat Chance : jet ${roll} ≤ ${thresholdBefore} → ${success ? "chanceux" : "malchanceux"}`);

        // Appliquer les effets conditionnels selon succès/échec
        const effects = success
            ? (test.effects_on_success ?? [])
            : (test.effects_on_failure ?? []);

        for (const effect of effects) {
            this.heroEngine.modifyAttribute(effect.attribute, effect.operation, effect.value);
            this.logger.info(`Effet pré-combat : ${effect.attribute} ${effect.operation} ${effect.value}`);
        }

        return {
            attribute: "chance",
            roll,
            threshold: thresholdBefore,
            success,
            preCombat: true,
            effects     // pour affichage UI
        };
    }

    // -------------------------------------------------------
    // Combat
    // -------------------------------------------------------

    /**
     * @private
     * @param {object[]} [preCombatResults]
     */
    async _resolveCombatParagraph(content, encounters, items, paragraphId, preCombatResults = []) {

        const monsters = this._loadMonsters(encounters);
        // Les règles sont portées par chaque monster (monster.rules).
        // rules[] global = tableau vide — évite la double application
        // dans applyPreCombatRules (monster.rules + flatMap seraient identiques).
        const rules = [];

        this.logger.debug(`Combat — ${monsters.length} monstre(s)`);

        const combatResult = await this.combatEngine.fight(monsters, rules);

        this.stateEngine.removeState(STATE_ID_COMBAT);

        // Mort du héros
        if (combatResult.outcome === "hero_dead") {
            return {
                paragraphId,
                content,
                items: [],
                log: combatResult.log,
                outcome: combatResult.outcome,
                gameOver: true,
                choices: []
            };
        }

        // Arrêt combat (seuil END atteint — ex §25)
        if (combatResult.outcome === "stopped") {
            return {
                paragraphId,
                content,
                narrativeContent: content,
                items,
                log: combatResult.log,
                outcome: combatResult.outcome,
                next: combatResult.stopParagraph,
                currentHeroDex: combatResult.finalDexterity,
                currentHeroEnd: combatResult.finalEndurance
            };
        }

        // Fuite
        if (combatResult.outcome === "fled") {
            const next = encounters[0].paragraph_flee ?? null;
            if (!next) throw new Error(`Combat (§${paragraphId}) : paragraph_flee non défini`);
            return {
                paragraphId,
                content,
                narrativeContent: content,
                items: [],
                log: combatResult.log,
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
            narrativeContent: content,
            items,                     // butin récupéré après victoire
            log: combatResult.log,
            outcome: combatResult.outcome,
            next,
            monsters,
            preCombatResults,          // tests pré-combat pour affichage UI
            currentHeroDex: combatResult.finalDexterity,
            currentHeroEnd: combatResult.finalEndurance
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
            id: e.character_id,
            name: e.character_name,
            dexterity: e.dexterity ?? e.character_dexterity,
            endurance: e.endurance ?? e.character_endurance,
            character_type: e.character_type,
            // target initial depuis la BDD — sera éventuellement surchargé
            // par les règles multi_enemy_behavior dans applyPreCombatRules
            target: e.character_target ?? (e.character_type === "ally" ? "other_enemy" : "hero"),
            rules: e.rules ?? []
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