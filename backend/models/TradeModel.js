import { db } from "../services/database.js";

// -------------------------------------------------------
// TradeModel
// Responsabilité : accès BDD aux offres de troc (table trade_offer)
//
// accepted_item_ids est stocké en JSON et parsé en tableau JS.
// -------------------------------------------------------
export class TradeModel {

    /**
     * Récupère toutes les offres de troc d'un paragraphe.
     * @param {number} paragraphId
     * @returns {Promise<object[]>}
     */
    static async findByParagraphId(paragraphId) {
        const [rows] = await db.query(
            `SELECT * FROM trade_offer WHERE paragraph_id = ?`,
            [paragraphId]
        );

        return rows.map(r => ({
            ...r,
            accepted_item_ids: this._parseJsonField(r.accepted_item_ids)
        }));
    }

    /** @private */
    static _parseJsonField(val) {
        if (!val) return [];
        if (Array.isArray(val)) return val;          // déjà parsé par le driver MySQL
        if (typeof val === "string" && val.trim()) {
            try { return JSON.parse(val); } catch { return []; }
        }
        return [];
    }
}