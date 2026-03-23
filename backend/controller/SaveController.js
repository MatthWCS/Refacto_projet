import { SaveModel } from "../models/SaveModel.js";

// -------------------------------------------------------
// SaveController
// Responsabilité : routes HTTP de sauvegarde/chargement
// req.user est fourni par le middleware isAuthenticated
// -------------------------------------------------------
export class SaveController {

    // POST /api/save/gamesave
    static async save(req, res) {
        try {
            const user_id = req.user.id;
            const {
                adventure_id,
                hero,
                current_paragraph_id,
                slot = "autosave"        // valeur par défaut
            } = req.body;

            if (!adventure_id || !hero || current_paragraph_id === undefined) {
                return res.status(400).json({
                    error: "Champs requis manquants : adventure_id, hero, current_paragraph_id"
                });
            }

            await SaveModel.saveProgress(
                user_id,
                adventure_id,
                hero,
                current_paragraph_id,
                slot
            );

            res.json({ success: true });

        } catch (err) {
            res.status(500).json({ error: "Impossible de sauvegarder la progression" });
        }
    }

    // GET /api/save/load?adventure_id=1&slot=autosave
    static async load(req, res) {
        try {
            const user_id = req.user.id;
            const {
                adventure_id,
                slot = "autosave"        // valeur par défaut
            } = req.query;

            if (!adventure_id) {
                return res.status(400).json({ error: "Champ requis manquant : adventure_id" });
            }

            const save = await SaveModel.loadProgress(
                user_id,
                parseInt(adventure_id, 10),
                slot
            );

            // save === null si aucune sauvegarde trouvée — le client gère ce cas
            res.json({ save });

        } catch (err) {
            res.status(500).json({ error: "Impossible de charger la progression" });
        }
    }
}