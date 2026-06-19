import { Router } from "express"
import { UserController } from "../../controller/UserController.js"

// -------------------------------------------------------
// userRoutes
// Préfixe : /api/user — protégé par isAdmin (router/index.js)
//
// GET    /api/user       — liste tous les comptes
// GET    /api/user/:id   — détail d'un compte
// POST   /api/user       — créer un compte
// PATCH  /api/user/:id   — modifier le username
// DELETE /api/user/:id   — supprimer un compte
// -------------------------------------------------------
export const userRoutes = Router()

userRoutes.get("/", UserController.list)
userRoutes.get("/:id", UserController.one)
userRoutes.post("/", UserController.create)
userRoutes.patch("/:id", UserController.update)
userRoutes.delete("/:id", UserController.delete)