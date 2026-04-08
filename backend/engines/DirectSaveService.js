import { SaveModel } from "../models/SaveModel.js";
import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// DirectSaveService
// Responsabilité : persistance de la sauvegarde en accès
//   direct BDD — à utiliser en mode Node (test-app, CLI).
//
// Implémente la même interface que SaveService (HTTP) :
//   save(heroData, currentParagraphId, slot?)
//   load(slot?)
//
// La différence : pas de fetch, on appelle SaveModel
// directement. Nécessite un user_id explicite puisqu'il
// n'y a pas de session HTTP.
// -------------------------------------------------------
export class DirectSaveService {

    /**
     * @param {number} adventureId
     * @param {number} userId       - ID de l'utilisateur courant
     * @param {Logger} [logger]
     */
    constructor(adventureId, userId, logger = new Logger(LogLevel.INFO, "[DirectSaveService]")) {
        this.adventureId = adventureId;
        this.userId = userId;
        this.logger = logger;
    }

    /**
     * @param {object} heroData
     * @param {number} currentParagraphId
     * @param {string} [slot]
     */
    async save(heroData, currentParagraphId, slot = "autosave") {
        try {
            await SaveModel.saveProgress(
                this.userId,
                this.adventureId,
                heroData,
                currentParagraphId,
                slot
            );
            this.logger.debug(`Sauvegarde OK — paragraphe ${currentParagraphId}, slot "${slot}"`);
        } catch (err) {
            this.logger.error("Erreur de sauvegarde :", err);
        }
    }

    /**
     * Efface la sauvegarde.
     * @param {string} [slot]
     */
    async clear(slot = "autosave") {
        try {
            await SaveModel.clearProgress(this.userId, this.adventureId, slot);
            this.logger.debug(`Sauvegarde effacée — slot "${slot}"`);
        } catch (err) {
            this.logger.error("Erreur lors de l'effacement :", err);
        }
    }

    /**
     * @param {string} [slot]
     * @returns {Promise<object|null>}
     */
    async load(slot = "autosave") {
        try {
            const save = await SaveModel.loadProgress(
                this.userId,
                this.adventureId,
                slot
            );
            this.logger.debug(`Chargement OK — slot "${slot}"`);
            return save;
        } catch (err) {
            this.logger.error("Erreur de chargement :", err);
            return null;
        }
    }
}