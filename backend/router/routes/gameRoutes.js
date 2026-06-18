import { Router } from "express";
import { GameController } from "../../controller/GameController.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

export const gameRoutes = Router();

gameRoutes.use(isAuthenticated);

// POST /api/game/start            — demarre / reprend la partie
gameRoutes.post("/start", GameController.start);
// GET  /api/game/state             — snapshot courant
gameRoutes.get("/state", GameController.state);
// POST /api/game/action            — { type, value } resout le pending courant
gameRoutes.post("/action", GameController.action);

// GET  /api/game/inventory
gameRoutes.get("/inventory", GameController.inventory);
// POST /api/game/inventory/use     — { item_id }
gameRoutes.post("/inventory/use", GameController.useItem);
// POST /api/game/inventory/equip   — { item_id }
gameRoutes.post("/inventory/equip", GameController.equipItem);
// POST /api/game/inventory/unequip — { item_id }
gameRoutes.post("/inventory/unequip", GameController.unequipItem);

// GET  /api/game/trade
gameRoutes.get("/trade", GameController.trades);
// POST /api/game/trade/execute     — { tradeOfferId, giveItemId }
gameRoutes.post("/trade/execute", GameController.executeTrade);