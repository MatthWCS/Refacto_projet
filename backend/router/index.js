import { Router } from "express";
import { authRoutes, userRoutes, saveRoutes } from "./routes/index.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

export const router = Router();

// -------------------------------------------------------
// Préfixe /api global — cohérent avec SaveService côté front
// qui appelle /api/save/gamesave et /api/save/load
// -------------------------------------------------------

// Auth — public (register, login, refresh-token) + protégé (/me)
router.use("/api/auth", authRoutes);

// Save — toutes les routes protégées par isAuthenticated (géré dans saveRoutes)
router.use("/api/save", saveRoutes);

// User — protégé admin uniquement
router.use("/api/user", isAdmin, userRoutes);