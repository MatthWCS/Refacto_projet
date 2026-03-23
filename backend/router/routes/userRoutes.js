import { Router } from "express"
import { UserController } from "../../controller/UserController.js"
import { isAdmin } from "../../middleware/isAdmin.js"

export const userRoutes = Router()

userRoutes.get("/", UserController.list)
userRoutes.get("/:id", UserController.one)
userRoutes.post("/", UserController.create)
userRoutes.patch("/", UserController.update)
userRoutes.delete("/:id", UserController.delete)

