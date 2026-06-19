import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

// -------------------------------------------------------
// isAdmin
// Vérifie le token JWT transmis via l'en-tête Authorization
// (Bearer) et que l'utilisateur a is_admin = 1.
// -------------------------------------------------------
export const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.slice(7);
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