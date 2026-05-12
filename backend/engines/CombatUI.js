import { Dice } from "./Dice.js";
import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// CombatUI
// Responsabilité : interaction joueur pendant les rounds
//
// Implémente l'interface attendue par CombatEngine.fight() :
//   async onRoundResolved(result, round, engine, rules) → boolean (true = fuir)
//
// Tu peux créer d'autres classes UI (ex. CombatUIWeb) qui
// respectent la même interface sans toucher à CombatEngine.
// -------------------------------------------------------
export class CombatUI {

    /**
     * @param {object} io     - Objet avec méthodes askLuckUsage() et askContinueOrFlee()
     * @param {Logger} [logger]
     */
    constructor(io, logger = new Logger(LogLevel.INFO)) {
        this.io = io;
        this.logger = logger;
    }

    /**
     * Appelé par CombatEngine.fight() avant le premier round (et après chaque mort de cible).
     * Délègue à this.io.askTarget().
     *
     * @param {object[]} enemies        - Ennemis vivants
     * @param {number|null} previousId  - Ancienne cible (morte)
     * @returns {Promise<number>} id de la cible choisie
     */
    async askTarget(enemies, previousId) {
        return this.io.askTarget(enemies, previousId);
    }

    /**
     * Appelé par CombatEngine après chaque resolveRound(), avant applyDuringCombatRules().
     * Peut modifier result.damagePerHit et result.extraDamage.
     *
     * @param {RoundResult} result
     * @param {number}      round
     * @param {CombatEngine} engine
     * @param {object[]}    rules
     * @returns {Promise<boolean>} true si le joueur fuit
     */
    async onRoundResolved(result, round, engine, rules, monsters = []) {

        this._printRoundHeader(result, round, engine);

        await this._handleLuck(result, engine);

        return await this._handleFleeChoice(engine, rules, monsters);
    }

    // -------------------------------------------------------
    // Affichage du round
    // -------------------------------------------------------

    /** @private */
    _printRoundHeader(result, round, engine) {
        const hero = engine.heroEngine.hero;

        this.logger.info(`\n===== ROUND ${round} =====`);
        this.logger.info(`Jet du héros   : ${result.heroAttack}`);
        this.logger.info(`DEX du héros   : ${hero.dexterity}`);
        this.logger.info(`END du héros   : ${hero.endurance}`);
        this.logger.info(`Chance actuelle: ${hero.luck}`);

        result.perEnemy.forEach(e => {
            if (e.attack === -Infinity) {
                this.logger.info(`${e.name} : mort`);
            } else {
                this.logger.info(`${e.name} : jet ${e.roll} → attaque ${e.attack}`);
            }
        });

        result.alliesHits.forEach(hit => {
            this.logger.info(`${hit.ally} touche ${hit.enemy} !`);
        });

        if (result.enemyHit) {
            this.logger.info("Le héros touche l'ennemi.");
        }
        if (result.charactersHitHero > 0) {
            this.logger.info(`Le héros est touché ${result.charactersHitHero} fois.`);
        }
    }

    // -------------------------------------------------------
    // Gestion de la Chance
    // -------------------------------------------------------

    /** @private */
    async _handleLuck(result, engine) {
        const hero = engine.heroEngine.hero;
        const luckChoice = await this.io.askLuckUsage(result);

        if (luckChoice === "none") return;

        const luckRoll = Dice.testLuck(hero);
        // Décrément unique — Dice.testLuck ne mute plus hero.luck
        engine.heroEngine.modifyAttribute("luck", "subtract", 1);

        this.logger.info(
            `Test de Chance : ${luckRoll.roll} → ${luckRoll.success ? "Chanceux !" : "Malchanceux !"}`
        );
        this.logger.info(`Chance restante : ${hero.luck}`);

        if (luckChoice === "reduce") {
            // Le joueur tente de réduire les dégâts reçus
            if (result.charactersHitHero > 0) {
                // Utiliser les valeurs lucky/unlucky de la règle si disponibles
                // sinon valeurs génériques (1 chanceux, 3 malchanceux)
                const lucky = result.luckDamageParams?.lucky ?? 1;
                const unlucky = result.luckDamageParams?.unlucky ?? 3;
                result.damagePerHit = luckRoll.success ? lucky : unlucky;
                this.logger.info(
                    `Dégâts reçus ajustés : ${result.damagePerHit} par touche`
                );
            }
        } else if (luckChoice === "increase") {
            // Le joueur tente d'augmenter les dégâts infligés
            if (result.enemyHit) {
                result.extraDamage = luckRoll.success ? LUCKY_DAMAGE_BONUS : -UNLUCKY_DAMAGE_MOD;
                this.logger.info(
                    `Dégâts infligés ajustés : ${result.extraDamage > 0 ? "+" : ""}${result.extraDamage}`
                );
            }
        }
    }

    // -------------------------------------------------------
    // Gestion de la fuite
    // -------------------------------------------------------

    /** @private */
    async _handleFleeChoice(engine, rules, monsters = []) {
        const canFlee = engine.canFlee(rules, monsters);
        const choice = await this.io.askContinueOrFlee(canFlee);

        if (choice === "flee") {
            this.logger.info("Le héros prend la fuite !");
            return true;
        }

        return false;
    }
}

// Constantes partagées avec CombatEngine (même sémantique)
const LUCKY_DAMAGE_BONUS = 2;
const UNLUCKY_DAMAGE_MOD = 1;