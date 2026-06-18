import { GameEngine } from "./GameEngine.js";
import { WebUI } from "./WebUI.js";
import { DirectSaveService } from "./DirectSaveService.js";
import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// GameSessionManager
// Responsabilite : tenir une instance GameEngine (+ WebUI)
//   en memoire par utilisateur connecte.
//
// Le moteur reste "suspendu" entre deux requetes HTTP —
// exactement comme il serait suspendu sur un io.ask() en
// console — grace aux Promises posees par WebUI._wait().
//
// Limite connue : une session perdue (redemarrage serveur)
// pendant un combat fait reprendre la partie depuis le
// dernier paragraphe sauvegarde (non-intermediaire), comme
// en mode console si le processus est interrompu.
// -------------------------------------------------------

const ADVENTURE_ID = 1;

/** @type {Map<number, object>} */
const sessions = new Map();

export class GameSessionManager {

    /**
     * @param {number} userId
     * @returns {object|null}
     */
    static get(userId) {
        return sessions.get(userId) ?? null;
    }

    /**
     * Recupere la session existante ou en cree une nouvelle
     * (sans démarrer le moteur — voir GameController.start).
     * @param {number} userId
     * @returns {Promise<object>}
     */
    static async getOrCreate(userId) {
        let session = sessions.get(userId);
        if (session) return session;

        const logger = new Logger(LogLevel.INFO, `[Game user=${userId}]`);
        const ui = new WebUI(logger);
        const saveService = new DirectSaveService(ADVENTURE_ID, userId, logger);

        const engine = new GameEngine({
            ui,
            adventureId: ADVENTURE_ID,
            logger,
            saveService,

            // Injection du CombatUI interactif — fight() recoit l'IO
            // en 3e parametre, comme en mode console (test-app.js).
            onBeforeStart: async (engine) => {
                const { combatEngine } = engine;
                const { combatUI } = ui;
                const _fight = combatEngine.fight.bind(combatEngine);
                combatEngine.fight = (monsters, rules) => _fight(monsters, rules, combatUI);
            }
        });

        session = { userId, engine, ui, logger, started: false };
        sessions.set(userId, session);
        return session;
    }

    /** @param {number} userId */
    static remove(userId) {
        sessions.delete(userId);
    }

    /**
     * Declenche une reprise du moteur et attend qu'il pose le
     * prochain pending (ou atteigne un etat terminal).
     *
     * @param {object}   session
     * @param {Function} trigger - fonction (sync ou async) qui relance le moteur
     * @returns {Promise<object>} le state WebUI a jour
     */
    static async runStep(session, trigger) {
        const { ui, logger } = session;

        const settled = new Promise(resolve => { ui.onSettled = resolve; });

        Promise.resolve()
            .then(trigger)
            .catch(err => {
                logger.error("Erreur pendant l'execution du moteur :", err);
                ui._settle("error", { message: "Erreur moteur." });
            });

        await settled;
        return ui.state;
    }
}