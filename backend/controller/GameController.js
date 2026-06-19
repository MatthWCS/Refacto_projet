import { GameSessionManager } from "../engines/GameSessionManager.js";
import { ParagraphModel } from "../models/ParagraphModel.js";

// -------------------------------------------------------
// GameController
// Responsabilite : exposer GameEngine (via WebUI) en HTTP.
// req.user est fourni par le middleware isAuthenticated.
// -------------------------------------------------------
export class GameController {

    // -------------------------------------------------------
    // Cycle de vie de la partie
    // -------------------------------------------------------

    // POST /api/game/start — { slot? }
    static async start(req, res) {
        try {
            const slot = req.body?.slot ?? "autosave"
            const session = await GameSessionManager.getOrCreate(req.user.id, slot)

            if (!session.started) {
                session.started = true
                await GameSessionManager.runStep(session, () => session.engine.start(0, slot))
            }

            res.json(session.ui.state)
        } catch (err) {
            res.status(500).json({ error: "Impossible de demarrer la partie." })
        }
    }

    // GET /api/game/state
    static async state(req, res) {
        const session = GameSessionManager.get(req.user.id);
        if (!session) {
            return res.status(404).json({ error: "Partie non demarree — appeler /api/game/start." });
        }
        res.json(session.ui.state);
    }

    // -------------------------------------------------------
    // Decisions du joueur — point d'attente courant
    // -------------------------------------------------------

    // POST /api/game/action — { type, value }
    static async action(req, res) {
        const session = GameSessionManager.get(req.user.id);
        if (!session) {
            return res.status(404).json({ error: "Partie non demarree." });
        }

        const { ui, engine } = session;
        const { type, value } = req.body;

        if (!ui.state.pending || ui.state.pending.type !== type) {
            return res.status(409).json({
                error: "Decision inattendue.",
                pending: ui.state.pending
            });
        }

        try {
            ui.beginTurn();
            await GameSessionManager.runStep(session, () => {
                const ok = ui.resolve(type, value);
                if (!ok) {
                    ui._settle("error", { message: "Decision invalide." });
                }
            });

            // Autosave après chaque action réussie (hors game over et états terminaux)
            const pendingType = ui.state.pending?.type
            const skipSave = ["game_over", "error", "closed"].includes(pendingType)
            if (!ui.state.isGameOver && !skipSave) {
                const slot = session.slot ?? "autosave"
                const hero = engine.heroEngine.hero.serialize()
                const paragraphId = engine.currentParagraphId
                engine.saveService.save(hero, paragraphId, slot).catch(err =>
                    session.logger.error("Autosave échouée :", err)
                )
            }

            res.json(ui.state);
        } catch (err) {
            session.logger.error("Erreur GameController.action :", err);
            res.status(500).json({ error: "Erreur lors du traitement de l'action." });
        }
    }

    // -------------------------------------------------------
    // Inventaire — actions hors flux de decision
    // -------------------------------------------------------

    // GET /api/game/inventory
    static async inventory(req, res) {
        const session = GameSessionManager.get(req.user.id);
        if (!session) {
            return res.status(404).json({ error: "Partie non demarree." });
        }

        const { heroEngine, inventoryEngine } = session.engine;

        const inventory = heroEngine.hero.inventory.map(invItem => {
            const def = inventoryEngine.getItemDefinition(invItem.item_id) ?? {};
            return { ...def, ...invItem };
        });

        res.json({ inventory });
    }

    // POST /api/game/inventory/use — { item_id }
    static async useItem(req, res) {
        const session = GameSessionManager.get(req.user.id);
        if (!session) {
            return res.status(404).json({ error: "Partie non demarree." });
        }

        const { engine, ui } = session;

        if (ui.isBlocked()) {
            return res.status(409).json({ error: "Une decision est en attente.", pending: ui.state.pending });
        }

        const { item_id } = req.body;
        const context = {
            inCombat: false,
            surprised: engine.stateEngine.hasState(9)
        };

        const result = engine.inventoryEngine.useItem(item_id, context);
        ui.refreshHero(engine.heroEngine.hero);

        if (!result.success) {
            return res.json({ ...result, state: ui.state });
        }

        // Mort suite a l'utilisation de l'objet (cf. GameEngine.goToParagraph)
        if (engine.heroEngine.hero.endurance <= 0) {
            engine.isGameOver = true;
            ui.triggerGameOver(engine.heroEngine.hero);
            return res.json({ ...result, state: ui.state });
        }

        // Objet avec texte d'ambiance associé (ex: §37/42/58 — flasques/gourde).
        // Ce n'est PAS une navigation : le paragraphe courant ne change pas,
        // on renvoie juste le texte du paragraphe cible à afficher (modale
        // frontend), pour éviter de rejouer un paragraphe déjà visité
        // (cf. ParagraphEngine.resolveParagraph qui réapplique tout sans
        // tracking de visite).
        let flavorContent = null;
        if (result.goto) {
            const flavorParagraph = await ParagraphModel.getParagraph(result.goto);
            flavorContent = flavorParagraph?.content ?? null;
        }

        res.json({ ...result, flavorContent, state: ui.state });
    }

    // POST /api/game/inventory/equip — { item_id }
    static async equipItem(req, res) {
        const session = GameSessionManager.get(req.user.id);
        if (!session) {
            return res.status(404).json({ error: "Partie non demarree." });
        }
        if (session.ui.isBlocked()) {
            return res.status(409).json({ error: "Une decision est en attente.", pending: session.ui.state.pending });
        }

        const { item_id } = req.body;
        session.engine.inventoryEngine.equipItem(item_id);
        session.ui.refreshHero(session.engine.heroEngine.hero);
        res.json({ success: true, state: session.ui.state });
    }

    // POST /api/game/inventory/unequip — { item_id }
    static async unequipItem(req, res) {
        const session = GameSessionManager.get(req.user.id);
        if (!session) {
            return res.status(404).json({ error: "Partie non demarree." });
        }
        if (session.ui.isBlocked()) {
            return res.status(409).json({ error: "Une decision est en attente.", pending: session.ui.state.pending });
        }

        const { item_id } = req.body;
        session.engine.inventoryEngine.unequipItem(item_id);
        session.ui.refreshHero(session.engine.heroEngine.hero);
        res.json({ success: true, state: session.ui.state });
    }

    // -------------------------------------------------------
    // Commerce / troc (§36)
    // -------------------------------------------------------

    // GET /api/game/trade
    static async trades(req, res) {
        const session = GameSessionManager.get(req.user.id);
        if (!session) {
            return res.status(404).json({ error: "Partie non demarree." });
        }

        const paragraphId = session.ui.state.paragraphId;
        const trades = await session.engine.tradeEngine.getAvailableTrades(paragraphId);
        res.json({ trades });
    }

    // POST /api/game/trade/execute — { tradeOfferId, giveItemId }
    static async executeTrade(req, res) {
        const session = GameSessionManager.get(req.user.id);
        if (!session) {
            return res.status(404).json({ error: "Partie non demarree." });
        }
        if (session.ui.isBlocked()) {
            return res.status(409).json({ error: "Une decision est en attente.", pending: session.ui.state.pending });
        }

        const { tradeOfferId, giveItemId } = req.body;
        const result = await session.engine.tradeEngine.executeTrade(tradeOfferId, giveItemId);
        session.ui.refreshHero(session.engine.heroEngine.hero);
        res.json({ ...result, state: session.ui.state });
    }
}