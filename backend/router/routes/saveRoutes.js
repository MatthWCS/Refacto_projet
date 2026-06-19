import { Router } from "express";
import { SaveController } from "../../controller/SaveController.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

// -------------------------------------------------------
// saveRoutes
// Préfixe : /api/save  (monté dans router/index.js)
//
// GET    /api/save          — liste les sauvegardes (max 3)
// POST   /api/save          — sauvegarde la session en cours
// GET    /api/save/load     — charge une save (?slot=xxx)
// DELETE /api/save/:slot    — supprime un slot
// -------------------------------------------------------

export const saveRoutes = Router();

saveRoutes.get("/", SaveController.list)
saveRoutes.post("/", SaveController.save);
saveRoutes.get("/load", SaveController.load);
saveRoutes.delete("/:slot", SaveController.deleteSave);