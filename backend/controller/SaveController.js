import { SaveModel } from "../models/SaveModel.js";
import { GameSessionManager } from "../engines/GameSessionManager.js";

const ADVENTURE_ID = 1;
const MAX_SAVES = 3;

// -------------------------------------------------------
// SaveController
// Responsabilité : routes HTTP de sauvegarde/chargement
// req.user est fourni par le middleware isAuthenticated
// -------------------------------------------------------
export class SaveController {

    // liste les sauvegardes de l'utilisateur
    static async list(req, res) {
        try {
            const saves = await SaveModel.listSaves(req.user.id, ADVENTURE_ID)
            res.json({ saves })
        } catch (err) {
            console.error("SaveController.list error:", err)
            res.status(500).json({ error: "Impossible de récupérer les sauvegardes" })
        }
    }


    // sauvegarde la session en cours dans un slot nommé
    static async save(req, res) {
        try {
            const user_id = req.user.id
            const { slot = "autosave" } = req.body

            // Vérifier la limite de 3 slots (sauf si le slot existe déjà)
            const existing = await SaveModel.listSaves(user_id, ADVENTURE_ID)
            const slotExists = existing.some(s => s.slot_name === slot)
            if (!slotExists && existing.length >= MAX_SAVES) {
                return res.status(409).json({
                    error: `Limite de ${MAX_SAVES} sauvegardes atteinte. Supprimez-en une avant d'en créer une nouvelle.`
                })
            }

            // Récupérer l'état depuis la session en mémoire
            const session = GameSessionManager.get(user_id)
            if (!session) {
                return res.status(404).json({ error: "Aucune partie en cours" })
            }

            const { engine } = session
            const hero = engine.heroEngine.hero.serialize()
            const current_paragraph_id = engine.currentParagraphId

            await SaveModel.saveProgress(user_id, ADVENTURE_ID, hero, current_paragraph_id, slot)
            res.json({ success: true, slot })

        } catch (err) {
            res.status(500).json({ error: "Impossible de sauvegarder la progression" })
        }
    }


    // charge une save
    static async load(req, res) {
        try {
            const user_id = req.user.id
            const { slot = "autosave" } = req.query

            const save = await SaveModel.loadProgress(user_id, ADVENTURE_ID, slot)
            if (!save) {
                return res.status(404).json({ error: "Sauvegarde introuvable" })
            }

            res.json({ save })

        } catch (err) {
            res.status(500).json({ error: "Impossible de charger la progression" })
        }
    }

    // supprime un slot
    static async deleteSave(req, res) {
        try {
            const user_id = req.user.id
            const { slot } = req.params

            if (!slot) {
                return res.status(400).json({ error: "Slot requis" })
            }

            await SaveModel.clearProgress(user_id, ADVENTURE_ID, slot)
            res.json({ success: true })

        } catch (err) {
            res.status(500).json({ error: "Impossible de supprimer la sauvegarde" })
        }
    }

}