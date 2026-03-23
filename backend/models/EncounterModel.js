import { db } from "../services/database.js";
import { ConditionModel } from "./ConditionModel.js";

// -------------------------------------------------------
// EncounterModel
// Responsabilité : accès BDD aux rencontres et leurs règles.
//
// Note : le JOIN sur character est fait dans ParagraphModel
// pour le pack complet d'un paragraphe. EncounterModel
// expose les mêmes requêtes de façon indépendante pour
// un usage unitaire (éditeur, debug, etc.).
// -------------------------------------------------------
export class EncounterModel {

    // -------------------------------------------------------
    // 1. Rencontres d'un paragraphe (avec JOIN character)
    // -------------------------------------------------------
    static async findByParagraphId(paragraphId) {
        const [rows] = await db.query(
            `SELECT e.*,
                    c.name           AS character_name,
                    c.character_type,
                    c.dexterity      AS character_dexterity,
                    c.endurance      AS character_endurance
             FROM \`encounter\` e
             JOIN \`character\` c ON c.id = e.character_id
             WHERE e.paragraph_id = ?
             ORDER BY e.encounter_order ASC`,
            [paragraphId]
        );
        return rows;
    }

    // -------------------------------------------------------
    // 2. Règles d'une rencontre (params JSON parsé)
    // -------------------------------------------------------
    static async findRules(encounterId) {
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
    // 3. Rencontres complètes (monstres + règles) — entrée principale
    // -------------------------------------------------------
    static async findFullEncounter(paragraphId) {
        const encounters = await this.findByParagraphId(paragraphId);
        for (const enc of encounters) {
            enc.rules = await this.findRules(enc.id);
        }
        return encounters;
    }

    // -------------------------------------------------------
    // 4. Effets sur un character (optionnel — éditeur)
    // -------------------------------------------------------
    static async findEffectsForCharacter(characterId) {
        const [rows] = await db.query(
            `SELECT * FROM \`effect\`
             WHERE source_type = 'character' AND source_type_id = ?`,
            [characterId]
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