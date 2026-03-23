import { db } from "../services/database.js";
import { ConditionModel } from "./ConditionModel.js";

// -------------------------------------------------------
// EffectModel
// Responsabilité : accès BDD aux effets (usage éditeur/admin).
//
// En gameplay, les effets sont chargés directement par
// ParagraphModel et ItemModel pour éviter des allers-retours
// BDD supplémentaires. EffectModel sert pour les outils
// d'édition ou des requêtes unitaires.
// -------------------------------------------------------
export class EffectModel {

    // -------------------------------------------------------
    // 1. Récupérer un effet par ID
    // -------------------------------------------------------
    static async findById(effectId) {
        const [rows] = await db.query(
            `SELECT * FROM \`effect\` WHERE id = ?`,
            [effectId]
        );
        if (!rows[0]) return null;

        const effect = rows[0];
        effect.condition = effect.condition_id
            ? ConditionModel.normalize(await ConditionModel.findById(effect.condition_id))
            : null;

        return effect;
    }

    // -------------------------------------------------------
    // 2. Effets d'une source (générique)
    // -------------------------------------------------------
    static async findBySource(source_type, source_type_id) {
        const [rows] = await db.query(
            `SELECT * FROM \`effect\`
             WHERE source_type = ? AND source_type_id = ?`,
            [source_type, source_type_id]
        );
        return this._attachConditions(rows);
    }

    // -------------------------------------------------------
    // 3. Raccourcis sémantiques
    // -------------------------------------------------------
    static findForItem(itemId) { return this.findBySource("item", itemId); }
    static findForParagraph(paragraphId) { return this.findBySource("paragraph", paragraphId); }
    static findForCharacter(characterId) { return this.findBySource("character", characterId); }

    // -------------------------------------------------------
    // 4. Tous les effets (éditeur)
    // -------------------------------------------------------
    static async getAll() {
        const [rows] = await db.query(
            `SELECT * FROM \`effect\` ORDER BY id ASC`
        );
        return this._attachConditions(rows);
    }

    // -------------------------------------------------------
    // Helper privé
    // -------------------------------------------------------

    /** @private */
    static async _attachConditions(rows) {
        for (const effect of rows) {
            effect.condition = effect.condition_id
                ? ConditionModel.normalize(await ConditionModel.findById(effect.condition_id))
                : null;
        }
        return rows;
    }
}