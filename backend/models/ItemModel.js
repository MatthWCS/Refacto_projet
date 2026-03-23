import { db } from "../services/database.js";
import { ConditionModel } from "./ConditionModel.js";

// -------------------------------------------------------
// ItemModel
// Responsabilité : accès BDD aux items et leurs effets
// -------------------------------------------------------
export class ItemModel {

    // -------------------------------------------------------
    // 1. Récupérer un item complet par ID
    // -------------------------------------------------------
    static async findById(itemId) {
        const [rows] = await db.query(
            `SELECT * FROM item WHERE id = ?`,
            [itemId]
        );
        if (!rows[0]) return null;

        const item = rows[0];
        item.effects = await this._loadEffects(item.id);
        return item;
    }

    // -------------------------------------------------------
    // 2. Récupérer tous les items (pour InventoryEngine)
    // -------------------------------------------------------
    static async getAll() {
        const [rows] = await db.query(`SELECT * FROM item ORDER BY id ASC`);

        for (const item of rows) {
            item.effects = await this._loadEffects(item.id);
        }

        return rows;
    }

    // -------------------------------------------------------
    // 3. Paragraphes où l'item apparaît (éditeur)
    // -------------------------------------------------------
    static async findParagraphAppearances(itemId) {
        const [rows] = await db.query(
            `SELECT pi.*, p.content
             FROM paragraph_item pi
             JOIN paragraph p ON p.id = pi.paragraph_id
             WHERE pi.item_id = ?`,
            [itemId]
        );
        return rows;
    }

    // -------------------------------------------------------
    // Helper privé — effets avec conditions normalisées
    // -------------------------------------------------------

    /** @private */
    static async _loadEffects(itemId) {
        const [rows] = await db.query(
            `SELECT * FROM \`effect\`
             WHERE source_type = 'item' AND source_type_id = ?`,
            [itemId]
        );

        for (const effect of rows) {
            effect.condition = effect.condition_id
                ? ConditionModel.normalize(await ConditionModel.findById(effect.condition_id))
                : null;
        }

        return rows;
    }
}