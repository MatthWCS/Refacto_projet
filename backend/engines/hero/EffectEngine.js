import { Logger, LogLevel } from "../Logger.js";

// -------------------------------------------------------
// EffectEngine
// Responsabilité : application des effets sur le héros
//   (attributs, flags, états, soins, dégâts)
// -------------------------------------------------------
export class EffectEngine {

    /**
     * @param {HeroEngine}      heroEngine
     * @param {ConditionEngine} conditionEngine
     * @param {StateEngine}     stateEngine
     * @param {Logger}          [logger]
     */
    constructor(heroEngine, conditionEngine, stateEngine, logger = new Logger(LogLevel.INFO, "[EffectEngine]")) {
        this.heroEngine = heroEngine;
        this.conditionEngine = conditionEngine;
        this.stateEngine = stateEngine;
        this.logger = logger;
    }

    // -------------------------------------------------------
    // 1. Appliquer une liste d'effets
    // -------------------------------------------------------

    /** @param {object[]} effects */
    applyEffects(effects) {
        effects.forEach(effect => this.applyEffect(effect));
    }

    // -------------------------------------------------------
    // 2. Appliquer un effet unique
    // -------------------------------------------------------

    /** @param {object} effect */
    applyEffect(effect) {
        // Condition préalable
        if (effect.condition && !this.conditionEngine.evaluateSQL(effect.condition)) {
            this.logger.debug(`Effet ignoré (condition non remplie) : ${effect.operation}`);
            return;
        }

        // Effet temporaire → déléguer à StateEngine
        if (effect.duration && effect.duration !== "instant") {
            this.stateEngine.applyStateFromEffect(effect);
            return;
        }

        // Effet instantané
        this.applyInstantEffect(effect);
    }

    // -------------------------------------------------------
    // 3. Effets instantanés (privé)
    // -------------------------------------------------------

    /** @private */
    applyInstantEffect(effect) {
        const { attribute, operation, value } = effect;

        // Validation minimale
        if (!operation) {
            this.logger.warn("applyInstantEffect : effet sans opération", effect);
            return;
        }

        switch (operation) {

            // --- Attributs numériques ---
            case "add":
            case "subtract":
            case "set_to":
            case "set_to_base":
                if (!attribute) {
                    this.logger.warn(`applyInstantEffect : "${operation}" sans attribut cible`);
                    return;
                }
                this.heroEngine.modifyAttribute(attribute, operation, value);
                break;

            // --- Soins (clampés par modifyAttribute) ---
            case "heal":
                this.heroEngine.modifyAttribute("endurance", "add", value);
                break;

            // --- Dégâts ---
            case "damage":
                this.heroEngine.modifyAttribute("endurance", "subtract", value);
                break;

            // --- Flags ---
            case "add_flag":
                this.heroEngine.addFlag(value);
                break;

            case "remove_flag":
                this.heroEngine.removeFlag(value);
                break;

            // --- États ---
            case "add_state":
                this.stateEngine.addState(value);
                break;

            case "remove_state":
                this.stateEngine.removeState(value);
                break;

            default:
                this.logger.warn(`applyInstantEffect : opération inconnue "${operation}"`);
        }

        this.logger.debug(`Effet appliqué : ${operation} ${attribute ?? ""} ${value ?? ""}`);
    }
}