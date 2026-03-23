import { db } from "../services/database.js";
import { ConditionModel } from "./ConditionModel.js";

// -------------------------------------------------------
// ParagraphModel
// Responsabilité : accès BDD aux paragraphes et leurs données
//   (choix, tests, items, effets, rencontres, règles)
// -------------------------------------------------------
export class ParagraphModel {

    // -------------------------------------------------------
    // 1. Paragraphe de base
    // -------------------------------------------------------
    static async getParagraph(id) {
        const [rows] = await db.query(
            `SELECT * FROM paragraph WHERE id = ?`,
            [id]
        );
        return rows[0] ?? null;
    }

    // -------------------------------------------------------
    // 2. Choix + conditions SQL
    // -------------------------------------------------------
    static async getChoices(paragraphId) {
        const [choices] = await db.query(
            `SELECT * FROM \`choice\` WHERE paragraph_id = ? ORDER BY id`,
            [paragraphId]
        );

        for (const choice of choices) {
            const [condRows] = await db.query(
                `SELECT c.*
                 FROM choice_condition cc
                 JOIN \`condition\` c ON c.id = cc.condition_id
                 WHERE cc.choice_id = ?`,
                [choice.id]
            );
            choice.conditions = condRows.map(c => ConditionModel.normalize(c));
        }

        return choices;
    }

    // -------------------------------------------------------
    // 3. Tests de dés
    // -------------------------------------------------------
    static async getTests(paragraphId) {
        const [rows] = await db.query(
            `SELECT * FROM dice_test WHERE paragraph_id = ?`,
            [paragraphId]
        );
        return rows;
    }

    // -------------------------------------------------------
    // 4. Items du paragraphe + leurs effets
    // -------------------------------------------------------
    static async getParagraphItems(paragraphId) {
        const [rows] = await db.query(
            `SELECT pi.*, i.name, i.type, i.usable, i.description
             FROM paragraph_item pi
             JOIN item i ON i.id = pi.item_id
             WHERE pi.paragraph_id = ?`,
            [paragraphId]
        );

        for (const item of rows) {
            item.effects = await this._loadEffectsWithConditions("item", item.item_id);
        }

        return rows;
    }

    // -------------------------------------------------------
    // 5. Effets du paragraphe + conditions SQL
    // -------------------------------------------------------
    static async getEffects(paragraphId) {
        return this._loadEffectsWithConditions("paragraph", paragraphId);
    }

    // -------------------------------------------------------
    // 6. Rencontres (données brutes JOIN character)
    // -------------------------------------------------------
    static async getEncounters(paragraphId) {
        const [rows] = await db.query(
            `SELECT e.*,
                    c.name             AS character_name,
                    c.character_type,
                    c.dexterity        AS character_dexterity,
                    c.endurance        AS character_endurance
             FROM \`encounter\` e
             JOIN \`character\` c ON c.id = e.character_id
             WHERE e.paragraph_id = ?
             ORDER BY e.encounter_order ASC`,
            [paragraphId]
        );
        return rows;
    }

    // -------------------------------------------------------
    // 7. Règles d'une rencontre (params JSON parsé)
    // -------------------------------------------------------
    static async getEncounterRules(encounterId) {
        const [rows] = await db.query(
            `SELECT * FROM encounter_rule WHERE encounter_id = ?`,
            [encounterId]
        );
        return rows.map(r => ({
            ...r,
            params: r.rule_value ? JSON.parse(r.rule_value) : {}
        }));
    }

    // -------------------------------------------------------
    // 8. Pack complet d'un paragraphe
    // -------------------------------------------------------
    static async getParagraphData(paragraphId) {

        const paragraph = await this.getParagraph(paragraphId);

        // Garde null AVANT toute déstructuration
        if (!paragraph) {
            return {
                content: null,
                is_surprised: false,
                choices: [],
                tests: [],
                items: [],
                effects: [],
                encounters: []
            };
        }

        const { content, is_surprised } = paragraph;

        const [choices, tests, items, effects, encounters] = await Promise.all([
            this.getChoices(paragraphId),
            this.getTests(paragraphId),
            this.getParagraphItems(paragraphId),
            this.getEffects(paragraphId),
            this.getEncounters(paragraphId)
        ]);

        // Charger les règles de chaque rencontre
        for (const enc of encounters) {
            enc.rules = await this.getEncounterRules(enc.id);
        }

        return {
            paragraphId,
            content,
            is_surprised,
            choices,
            tests,
            items,
            effects,
            encounters
        };
    }

    // -------------------------------------------------------
    // Helper privé — effets + conditions SQL
    // -------------------------------------------------------

    /**
     * @private
     * Charge les effets d'une source et normalise leurs conditions.
     *
     * @param {"paragraph"|"item"|"character"} sourceType
     * @param {number} sourceId
     * @returns {Promise<object[]>}
     */
    static async _loadEffectsWithConditions(sourceType, sourceId) {
        const [rows] = await db.query(
            `SELECT * FROM \`effect\`
             WHERE source_type = ? AND source_type_id = ?`,
            [sourceType, sourceId]
        );

        for (const effect of rows) {
            if (effect.condition_id) {
                const raw = await ConditionModel.findById(effect.condition_id);
                effect.condition = ConditionModel.normalize(raw);
            } else {
                effect.condition = null;
            }
        }

        return rows;
    }
}