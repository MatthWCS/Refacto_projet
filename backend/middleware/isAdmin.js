import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

// -------------------------------------------------------
// isAdmin
// Vérifie que l'utilisateur authentifié a is_admin = 1.
// Peut être utilisé seul (vérifie aussi le token) ou après
// isAuthenticated (req.user déjà disponible).
// -------------------------------------------------------
export const isAdmin = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await UserModel.findById(decoded.user.id);

        if (!user || !user.is_admin) {
            return res.status(403).json({ message: "Forbidden — admin only" });
        }

        req.user = { ...decoded.user, is_admin: user.is_admin };
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};