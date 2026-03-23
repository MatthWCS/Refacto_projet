import { Router } from "express"
import { AuthController } from "../../controller/AuthController.js"
import { isAuthenticated } from "../../middleware/isAuthenticated.js"

// on creer un router pour gerer les routes d'authentification
export const authRoutes = Router()

authRoutes.post("/register", AuthController.register)
// on y ajoute une route "/login", geree par la method login de AuthController en methode HTTP POST
authRoutes.post("/login", AuthController.login)
// on y ajoute une route "/logout", geree par la method login de AuthController en methode HTTP GET
authRoutes.get("/logout", AuthController.logout)
// on y ajoute une route "/me", , geree par la method me de AuthController en methode HTTP GET
authRoutes.get("/me", isAuthenticated, AuthController.me)
/* authRoutes.get("/me", isAuthenticated, AuthController.me)
* on y ajoute une route "/refresh-token", , geree par la method refreshToken de AuthController en methode HTTP GET */
authRoutes.get("/refresh-token", AuthController.refreshToken)