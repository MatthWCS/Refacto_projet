import { Logger, LogLevel } from "../Logger.js";

// -------------------------------------------------------
// ConditionEngine
// Responsabilité : évaluation des conditions SQL et simples
// -------------------------------------------------------
export class ConditionEngine {

    /**
     * @param {HeroEngine} heroEngine
     * @param {Logger}     [logger]
     */
    constructor(heroEngine, logger = new Logger(LogLevel.INFO, "[ConditionEngine]")) {
        this.heroEngine = heroEngine;
        this.logger = logger;
    }

    // -------------------------------------------------------
    // 1. Condition structurée (format SQL / objet)
    // -------------------------------------------------------

    /**
     * Évalue une condition structurée issue de la base.
     * @param {{ type, attribute?, flag_id?, item_id?, state_id?, operator, value }} condition
     * @returns {boolean}
     */
    evaluateSQL(condition) {
        if (!condition) return true;

        switch (condition.type) {
            case "attribute":
                return this._compare(
                    this.heroEngine.getAttribute(condition.attribute),
                    condition.operator,
                    condition.value
                );
            case "flag":
                return this._compare(
                    this.heroEngine.hasFlag(condition.flag_id),
                    condition.operator,
                    true
                );
            case "item":
                return this._compare(
                    this.heroEngine.hasItem(condition.item_id),
                    condition.operator,
                    true
                );
            case "item_equipped":
                return this._compare(
                    this.heroEngine.isItemEquipped(condition.item_id),
                    condition.operator,
                    true
                );
            case "state":
                return this._compare(
                    this.heroEngine.hasState(condition.state_id),
                    condition.operator,
                    true
                );
            default:
                this.logger.warn(`evaluateSQL : type de condition inconnu "${condition.type}"`);
                return true;
        }
    }

    /**
     * Évalue toutes les conditions (AND implicite).
     * @param {object[]} conditions
     * @returns {boolean}
     */
    evaluateAllSQL(conditions) {
        return conditions.every(c => this.evaluateSQL(c));
    }

    // -------------------------------------------------------
    // 2. Condition simple (format string)
    //    Utilisée notamment par StateEngine (remove_condition)
    // -------------------------------------------------------

    /**
     * Évalue une condition sous forme de chaîne.
     * Formats supportés :
     *   "has_item:3"   "has_flag:2"   "has_state:5"
     *   "endurance>=10"   "luck<=3"
     *
     * @param {string} condition
     * @returns {boolean}
     */
    evaluateSimple(condition) {
        if (!condition) return true;

        // has_item:N
        if (condition.startsWith("has_item:")) {
            const id = parseInt(condition.split(":")[1], 10);
            return this.heroEngine.hasItem(id);
        }

        // has_flag:N
        if (condition.startsWith("has_flag:")) {
            const id = parseInt(condition.split(":")[1], 10);
            return this.heroEngine.hasFlag(id);
        }

        // has_state:N
        if (condition.startsWith("has_state:")) {
            const id = parseInt(condition.split(":")[1], 10);
            return this.heroEngine.hasState(id);
        }

        // attribute >= value
        if (condition.includes(">=")) {
            const [attr, val] = condition.split(">=");
            return this.heroEngine.getAttribute(attr.trim()) >= parseInt(val, 10);
        }

        // attribute <= value
        if (condition.includes("<=")) {
            const [attr, val] = condition.split("<=");
            return this.heroEngine.getAttribute(attr.trim()) <= parseInt(val, 10);
        }

        this.logger.warn(`evaluateSimple : format de condition non reconnu "${condition}"`);
        return false;
    }

    // -------------------------------------------------------
    // 3. Comparateur générique (privé)
    // -------------------------------------------------------

    /** @private */
    _compare(left, operator, right) {
        switch (operator) {
            case ">": return left > right;
            case ">=": return left >= right;
            case "<": return left < right;
            case "<=": return left <= right;
            case "==": return left == right;
            case "!=": return left != right;
            case "has": return !!left;
            case "not_has": return !left;
            default:
                this.logger.warn(`_compare : opérateur inconnu "${operator}"`);
                return true;
        }
    }
}