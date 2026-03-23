import { db } from "../services/database.js";

// -------------------------------------------------------
// ConditionModel
// Responsabilité : accès BDD aux conditions et normalisation
// -------------------------------------------------------
export class ConditionModel {

    // -------------------------------------------------------
    // 1. Récupérer une condition par ID
    // -------------------------------------------------------
    static async findById(conditionId) {
        const [rows] = await db.query(
            `SELECT * FROM \`condition\` WHERE id = ?`,
            [conditionId]
        );
        return rows[0] ?? null;
    }

    // -------------------------------------------------------
    // 2. Récupérer plusieurs conditions par IDs
    // -------------------------------------------------------
    static async findByIds(conditionIds) {
        if (!conditionIds?.length) return [];
        const placeholders = conditionIds.map(() => "?").join(",");
        const [rows] = await db.query(
            `SELECT * FROM \`condition\` WHERE id IN (${placeholders})`,
            conditionIds
        );
        return rows;
    }

    // -------------------------------------------------------
    // 3. Conditions d'un choix
    // -------------------------------------------------------
    static async findForChoice(choiceId) {
        const [rows] = await db.query(
            `SELECT c.*
             FROM choice_condition cc
             JOIN \`condition\` c ON c.id = cc.condition_id
             WHERE cc.choice_id = ?`,
            [choiceId]
        );
        return rows.map(c => this.normalize(c));
    }

    // -------------------------------------------------------
    // 4. Conditions d'un effet
    // -------------------------------------------------------
    static async findForEffect(effectId) {
        const [rows] = await db.query(
            `SELECT c.*
             FROM \`effect\` e
             JOIN \`condition\` c ON c.id = e.condition_id
             WHERE e.id = ?`,
            [effectId]
        );
        return rows.map(c => this.normalize(c));
    }

    // -------------------------------------------------------
    // 5. Toutes les conditions (éditeur)
    // -------------------------------------------------------
    static async getAll() {
        const [rows] = await db.query(
            `SELECT * FROM \`condition\` ORDER BY id ASC`
        );
        return rows.map(c => this.normalize(c));
    }

    // -------------------------------------------------------
    // Normalisation — format compatible ConditionEngine.evaluateSQL()
    // -------------------------------------------------------

    /**
     * @param {object|null} c
     * @returns {object|null}
     */
    static normalize(c) {
        if (!c) return null;
        return {
            id: c.id,
            type: c.type ?? null,
            attribute: c.attribute ?? null,
            operator: c.operator ?? null,
            value: c.value ?? null,
            item_id: c.item_id ?? null,
            flag_id: c.flag_id ?? null,
            state_id: c.state_id ?? null
        };
    }
}