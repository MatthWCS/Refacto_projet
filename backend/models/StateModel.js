import { db } from "../services/database.js";

// -------------------------------------------------------
// StateModel
// Responsabilité : accès BDD aux définitions d'états.
//
// remove_condition est retourné comme chaîne brute.
// L'évaluation est déléguée à ConditionEngine.evaluateSQL()
// via l'objet structuré fourni par les colonnes SQL.
// -------------------------------------------------------
export class StateModel {

    // -------------------------------------------------------
    // 1. Récupérer un état par ID
    // -------------------------------------------------------
    static async findById(stateId) {
        const [rows] = await db.query(
            `SELECT * FROM state WHERE id = ?`,
            [stateId]
        );
        return rows[0] ?? null;
    }

    // -------------------------------------------------------
    // 2. Récupérer tous les états (pour StateEngine)
    // -------------------------------------------------------

    /**
     * Retourne tous les états avec remove_condition sous forme
     * d'objet structuré compatible avec ConditionEngine.evaluateSQL().
     *
     * Format retourné pour remove_condition :
     *   null | { type, operator, attribute?, flag_id?, item_id?, state_id?, value? }
     */
    static async getAll() {
        const [rows] = await db.query(
            `SELECT * FROM state ORDER BY id ASC`
        );

        return rows.map(state => ({
            ...state,
            remove_condition: this.parseRemoveCondition(state.remove_condition)
        }));
    }

    // -------------------------------------------------------
    // 3. Récupérer les états actifs d'un héros (avec métadonnées)
    // -------------------------------------------------------
    static async findHeroStates(saveId) {
        const [rows] = await db.query(
            `SELECT hs.*, s.name, s.description, s.state_type, s.attribute, s.value, s.duration, s.remove_condition
             FROM hero_state hs
             JOIN state s ON s.id = hs.state_id
             WHERE hs.save_id = ?`,
            [saveId]
        );
        return rows;
    }

    // -------------------------------------------------------
    // Parsing interne — produit un objet compatible evaluateSQL
    // -------------------------------------------------------

    /**
     * @private
     * Convertit une chaîne remove_condition en objet structuré
     * compatible avec ConditionEngine.evaluateSQL().
     *
     * @param {string|null} str
     * @returns {object|null}
     */
    static parseRemoveCondition(str) {
        if (!str) return null;

        // has_flag:N
        if (str.startsWith("has_flag:")) {
            return { type: "flag", operator: "has", flag_id: parseInt(str.split(":")[1], 10) };
        }
        // has_item:N
        if (str.startsWith("has_item:")) {
            return { type: "item", operator: "has", item_id: parseInt(str.split(":")[1], 10) };
        }
        // has_state:N
        if (str.startsWith("has_state:")) {
            return { type: "state", operator: "has", state_id: parseInt(str.split(":")[1], 10) };
        }

        // Opérateurs de comparaison — ordre important (>= avant >)
        const operators = [">=", "<=", ">", "<"];
        for (const op of operators) {
            if (str.includes(op)) {
                const [attr, val] = str.split(op);
                return {
                    type: "attribute",
                    attribute: attr.trim(),
                    operator: op,
                    value: parseInt(val, 10)
                };
            }
        }

        return null;
    }
}