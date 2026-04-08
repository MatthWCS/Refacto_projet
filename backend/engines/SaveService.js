import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// SaveService
// Responsabilité : persistance HTTP de la sauvegarde
// -------------------------------------------------------
export class SaveService {

    /**
     * @param {number} adventureId
     * @param {Logger} [logger]
     */
    constructor(adventureId, logger = new Logger(LogLevel.INFO, "[SaveService]")) {
        this.adventureId = adventureId;
        this.logger = logger;
    }

    /**
     * Sauvegarde la progression du joueur.
     * @param {object} heroData
     * @param {number} currentParagraphId
     * @param {string} [slot]
     */
    async save(heroData, currentParagraphId, slot = "autosave") {
        try {
            await fetch("/api/save/gamesave", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adventure_id: this.adventureId,
                    hero: heroData,
                    current_paragraph_id: currentParagraphId,
                    slot
                })
            });
            this.logger.debug(`Sauvegarde OK — paragraphe ${currentParagraphId}, slot "${slot}"`);
        } catch (err) {
            this.logger.error("Erreur de sauvegarde :", err);
        }
    }

    /**
     * Efface la sauvegarde (appelé après une fin d'aventure pour permettre de rejouer).
     * @param {string} [slot]
     */
    async clear(slot = "autosave") {
        try {
            await fetch(`/api/save/clear?adventure_id=${this.adventureId}&slot=${slot}`, {
                method: "DELETE",
                credentials: "include"
            });
            this.logger.debug(`Sauvegarde effacée — slot "${slot}"`);
        } catch (err) {
            this.logger.error("Erreur lors de l'effacement :", err);
        }
    }

    /**
     * Charge la progression du joueur.
     * @param {string} [slot]
     * @returns {Promise<object|null>}
     */
    async load(slot = "autosave") {
        try {
            const res = await fetch(
                `/api/save/load?adventure_id=${this.adventureId}&slot=${slot}`,
                { credentials: "include" }
            );
            const data = await res.json();
            this.logger.debug(`Chargement OK — slot "${slot}"`);
            return data.save ?? null;
        } catch (err) {
            this.logger.error("Erreur de chargement :", err);
            return null;
        }
    }
}