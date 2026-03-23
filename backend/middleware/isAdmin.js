import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

// -------------------------------------------------------
// isAdmin
// Vérifie que l'utilisateur authentifié a le rôle "admin".
// Doit être utilisé APRÈS isAuthenticated (req.user déjà dispo).
// -------------------------------------------------------
export const isAdmin = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Le payload JWT est { user: { id, name, role, ... } }
        // cohérent avec AuthController.login qui signe { user: cleanUser }
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await UserModel.findById(decoded.user.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden — admin only" });
        }

        req.user = decoded.user;

        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};