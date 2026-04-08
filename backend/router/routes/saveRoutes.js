import { Router } from "express";
import { SaveController } from "../../controller/SaveController.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

// -------------------------------------------------------
// saveRoutes
// Préfixe : /api/save  (monté dans router/index.js)
//
// POST /api/save/gamesave  — sauvegarde la progression
// GET  /api/save/load      — charge la progression
// -------------------------------------------------------
export const saveRoutes = Router();

saveRoutes.post("/gamesave", isAuthenticated, SaveController.save);
saveRoutes.get("/load", isAuthenticated, SaveController.load);
// saveRoutes.delete("/clear", isAuthenticated, SaveController.clear);