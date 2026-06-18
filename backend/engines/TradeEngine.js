import { Logger, LogLevel } from "./Logger.js";
import { TradeModel } from "../models/TradeModel.js";

// -------------------------------------------------------
// TradeEngine
// Responsabilité : logique de troc 1-pour-1 (§36 — Arilys)
//
// Chaque trade_offer propose un item (Baume, Décoction, Poison)
// en échange de l'un des items listés dans accepted_item_ids.
// Chaque offre ne peut être effectuée qu'une seule fois
// (hero.trades mémorise les trade_offer_id déjà utilisés).
// -------------------------------------------------------
export class TradeEngine {

    /**
     * @param {HeroEngine}      heroEngine
     * @param {InventoryEngine} inventoryEngine
     * @param {Logger}          [logger]
     */
    constructor(heroEngine, inventoryEngine, logger = new Logger(LogLevel.INFO, "[TradeEngine]")) {
        this.heroEngine = heroEngine;
        this.inventoryEngine = inventoryEngine;
        this.logger = logger;
    }

    // -------------------------------------------------------
    // 1. Offres disponibles pour un paragraphe
    // -------------------------------------------------------

    /**
     * Retourne les offres de troc non encore effectuées, enrichies
     * de la liste des items du joueur qui peuvent être donnés en échange.
     *
     * @param {number} paragraphId
     * @returns {Promise<object[]>} [{ id, item_id, description, giveableItemIds }]
     */
    async getAvailableTrades(paragraphId) {
        const offers = await TradeModel.findByParagraphId(paragraphId);
        const hero = this.heroEngine.hero;

        return offers
            .filter(offer => !hero.trades.includes(offer.id))
            .map(offer => {
                const giveableItemIds = offer.accepted_item_ids.filter(itemId =>
                    this.heroEngine.hasItem(itemId)
                );
                return {
                    id: offer.id,
                    item_id: offer.item_id,
                    description: offer.description,
                    giveableItemIds   // items que le joueur possède et peut donner
                };
            });
    }

    // -------------------------------------------------------
    // 2. Exécuter un troc
    // -------------------------------------------------------

    /**
     * @param {number} tradeOfferId
     * @param {number} giveItemId   - item donné par le joueur en échange
     * @returns {{ success: boolean, message?: string }}
     */
    async executeTrade(tradeOfferId, giveItemId) {
        const hero = this.heroEngine.hero;

        if (hero.trades.includes(tradeOfferId)) {
            return { success: false, message: "Ce troc a déjà été effectué." };
        }

        const offer = await this._findOfferById(tradeOfferId);
        if (!offer) {
            return { success: false, message: "Offre de troc inconnue." };
        }

        if (!offer.accepted_item_ids.includes(giveItemId)) {
            return { success: false, message: "Cet objet n'est pas accepté en échange." };
        }

        if (!this.heroEngine.hasItem(giveItemId)) {
            return { success: false, message: "Vous ne possédez pas cet objet." };
        }

        // Retirer l'item donné (déclenche _recalculateInitialAttributes si pertinent)
        this.inventoryEngine.removeItem(giveItemId, 1);

        // Ajouter l'item d'Arilys (déclenche ses effets via addItem)
        this.inventoryEngine.addItem(offer.item_id, 1);

        // Marquer le troc comme effectué
        hero.trades.push(tradeOfferId);

        this.logger.info(`Troc effectué : item ${giveItemId} → item ${offer.item_id} (offre #${tradeOfferId})`);
        return { success: true };
    }

    // -------------------------------------------------------
    // Helpers privés
    // -------------------------------------------------------

    /** @private */
    async _findOfferById(tradeOfferId) {
        // TradeModel n'expose que findByParagraphId — on parcourt §36
        // (seul paragraphe avec des offres pour l'instant)
        const offers = await TradeModel.findByParagraphId(36);
        return offers.find(o => o.id === tradeOfferId) ?? null;
    }
}