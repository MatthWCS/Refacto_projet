import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

// -------------------------------------------------------
// isAuthenticated
// Vérifie le token JWT transmis via l'en-tête Authorization
// (Bearer) et attache req.user pour les controllers en aval.
//
// L'access token n'est jamais stocké en cookie : il vit en
// mémoire côté client (store Redux), perdu au rechargement
// de page — seul le refresh_token (httpOnly cookie) persiste.
// -------------------------------------------------------
export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.slice(7);
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        // Attache l'utilisateur décodé à la requête
        // → accessible via req.user dans tous les controllers
        req.user = decoded.user;

        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};