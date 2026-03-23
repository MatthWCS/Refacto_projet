import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

// -------------------------------------------------------
// isAuthenticated
// Vérifie le token JWT et attache req.user pour les
// controllers en aval.
// -------------------------------------------------------
export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        // Attache l'utilisateur décodé à la requête
        // → accessible via req.user dans tous les controllers
        req.user = decoded.user;

        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};