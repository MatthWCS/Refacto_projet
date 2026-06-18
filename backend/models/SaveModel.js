import { db } from "../services/database.js";

// -------------------------------------------------------
// SaveModel
// Responsabilité : persistance BDD de la progression
//   (appelé côté serveur — user_id résolu depuis la session)
// -------------------------------------------------------
export class SaveModel {

    // -------------------------------------------------------
    // 1. Sauvegarder la progression
    // -------------------------------------------------------

    /**
     * @param {number} user_id              - Résolu depuis la session HTTP
     * @param {number} adventure_id
     * @param {object} hero                 - Résultat de hero.serialize()
     * @param {number} current_paragraph_id
     * @param {string} [slot]
     */
    static async saveProgress(user_id, adventure_id, hero, current_paragraph_id, slot = "autosave") {

        // 1.1 Upsert game_save
        await db.query(
            `INSERT INTO game_save (user_id, adventure_id, current_paragraph_id, slot_name)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                 current_paragraph_id = VALUES(current_paragraph_id),
                 updated_at           = NOW()`,
            [user_id, adventure_id, current_paragraph_id, slot]
        );

        const [rows] = await db.query(
            `SELECT id FROM game_save
             WHERE user_id = ? AND adventure_id = ? AND slot_name = ?`,
            [user_id, adventure_id, slot]
        );
        const save_id = rows[0].id;

        // 1.2 Upsert hero
        await db.query(
            `INSERT INTO hero
                 (save_id, dexterity, initial_dexterity, endurance, initial_endurance,
                  luck, initial_luck, drunkness)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                 dexterity         = VALUES(dexterity),
                 initial_dexterity = VALUES(initial_dexterity),
                 endurance         = VALUES(endurance),
                 initial_endurance = VALUES(initial_endurance),
                 luck              = VALUES(luck),
                 initial_luck      = VALUES(initial_luck),
                 drunkness         = VALUES(drunkness)`,
            [
                save_id,
                hero.dexterity, hero.initial_dexterity,
                hero.endurance, hero.initial_endurance,
                hero.luck, hero.initial_luck,
                hero.drunkness
            ]
        );

        // 1.3 Inventaire (delete + re-insert)
        await db.query(`DELETE FROM hero_inventory WHERE save_id = ?`, [save_id]);
        for (const item of hero.inventory) {
            await db.query(
                `INSERT INTO hero_inventory (save_id, item_id, quantity, is_equipped)
                 VALUES (?, ?, ?, ?)`,
                [save_id, item.item_id, item.quantity, item.is_equipped]
            );
        }

        // 1.4 Flags
        await db.query(`DELETE FROM hero_flag WHERE save_id = ?`, [save_id]);
        for (const flag_id of hero.flags) {
            await db.query(
                `INSERT INTO hero_flag (save_id, flag_id) VALUES (?, ?)`,
                [save_id, flag_id]
            );
        }

        // 1.5 États
        await db.query(`DELETE FROM hero_state WHERE save_id = ?`, [save_id]);
        for (const state of hero.states) {
            // remaining_duration doit être un entier ou NULL
            const duration = (state.remaining_duration === null || state.remaining_duration === "permanent")
                ? null
                : parseInt(state.remaining_duration, 10);
            await db.query(
                `INSERT INTO hero_state (save_id, state_id, remaining_duration)
                 VALUES (?, ?, ?)`,
                [save_id, state.state_id, duration]
            );
        }

        // 1.6 Trocs effectués (§36)
        await db.query(`DELETE FROM hero_trade WHERE save_id = ?`, [save_id]);
        for (const tradeOfferId of hero.trades ?? []) {
            await db.query(
                `INSERT INTO hero_trade (save_id, trade_offer_id) VALUES (?, ?)`,
                [save_id, tradeOfferId]
            );
        }

        return { success: true };
    }

    // -------------------------------------------------------
    // 2. Charger la progression
    // -------------------------------------------------------

    /**
     * @param {number} user_id
     * @param {number} adventure_id
     * @param {string} [slot]
     * @returns {Promise<{ hero: object, current_paragraph_id: number } | null>}
     */
    static async loadProgress(user_id, adventure_id, slot = "autosave") {

        const [saveRows] = await db.query(
            `SELECT id, current_paragraph_id FROM game_save
             WHERE user_id = ? AND adventure_id = ? AND slot_name = ?`,
            [user_id, adventure_id, slot]
        );

        if (!saveRows[0]) return null;

        const save_id = saveRows[0].id;
        const current_paragraph_id = saveRows[0].current_paragraph_id;

        // Hero
        const [heroRows] = await db.query(
            `SELECT * FROM hero WHERE save_id = ?`,
            [save_id]
        );
        if (!heroRows[0]) return null;
        const hero = heroRows[0];

        // Inventaire
        const [invRows] = await db.query(
            `SELECT item_id, quantity, is_equipped FROM hero_inventory WHERE save_id = ?`,
            [save_id]
        );
        hero.inventory = invRows;

        // Flags
        const [flagRows] = await db.query(
            `SELECT flag_id FROM hero_flag WHERE save_id = ?`,
            [save_id]
        );
        hero.flags = flagRows.map(r => r.flag_id);

        // États
        const [stateRows] = await db.query(
            `SELECT state_id, remaining_duration FROM hero_state WHERE save_id = ?`,
            [save_id]
        );
        hero.states = stateRows;

        // Trocs effectués (§36)
        const [tradeRows] = await db.query(
            `SELECT trade_offer_id FROM hero_trade WHERE save_id = ?`,
            [save_id]
        );
        hero.trades = tradeRows.map(r => r.trade_offer_id);

        return { hero, current_paragraph_id };
    }

    // -------------------------------------------------------
    // 3. Effacer la progression
    // -------------------------------------------------------

    /**
     * Supprime la sauvegarde et toutes les données associées.
     * Nécessite ON DELETE CASCADE sur save_id dans hero_inventory,
     * hero_flag et hero_state — sinon les lignes orphelines restent.
     *
     * @param {number} user_id
     * @param {number} adventure_id
     * @param {string} [slot]
     */
    static async clearProgress(user_id, adventure_id, slot = "autosave") {

        // Récupérer le save_id pour supprimer les données liées
        // si CASCADE n'est pas configuré en BDD
        const [rows] = await db.query(
            `SELECT id FROM game_save
             WHERE user_id = ? AND adventure_id = ? AND slot_name = ?`,
            [user_id, adventure_id, slot]
        );

        if (!rows[0]) return { success: true }; // rien à effacer

        const save_id = rows[0].id;

        // Supprimer les données liées explicitement
        // (sécurisé même sans CASCADE)
        await db.query(`DELETE FROM hero_inventory WHERE save_id = ?`, [save_id]);
        await db.query(`DELETE FROM hero_flag WHERE save_id = ?`, [save_id]);
        await db.query(`DELETE FROM hero_state WHERE save_id = ?`, [save_id]);
        await db.query(`DELETE FROM hero_trade WHERE save_id = ?`, [save_id]);
        await db.query(`DELETE FROM hero WHERE save_id = ?`, [save_id]);
        await db.query(`DELETE FROM game_save WHERE id = ?`, [save_id]);

        return { success: true };
    }
}