import bcrypt from "bcrypt"
import { UserModel } from "../models/UserModel.js"

export class UserController {

    // GET /api/user — liste tous les comptes (admin)
    static async list(req, res) {
        try {
            const users = await UserModel.findAll()
            res.json({ users })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    // GET /api/user/:id — détail d'un compte (admin)
    static async one(req, res) {
        try {
            const user = await UserModel.findById(req.params.id)
            if (!user) return res.status(404).json({ message: "Utilisateur introuvable" })
            res.json({ user })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    // POST /api/user — créer un compte (admin)
    static async create(req, res) {
        try {
            const { username, email, password } = req.body

            if (!username || !email || !password) {
                return res.status(400).json({ message: "Tous les champs sont requis" })
            }

            const emailUsed = await UserModel.findByEmail(email)
            if (emailUsed) {
                return res.status(409).json({ message: "Email déjà utilisé" })
            }

            const usernameUsed = await UserModel.findByUsername(username)
            if (usernameUsed) {
                return res.status(409).json({ message: "Nom d'utilisateur déjà pris" })
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            await UserModel.create({ username, email, password: hashedPassword })

            res.status(201).json({ message: "Compte créé avec succès" })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    // PATCH /api/user/:id — modifier un compte (admin, username seulement)
    static async update(req, res) {
        try {
            const { username } = req.body
            if (!username) {
                return res.status(400).json({ message: "Username requis" })
            }

            const existing = await UserModel.findByUsername(username)
            if (existing && existing.id !== parseInt(req.params.id)) {
                return res.status(409).json({ message: "Nom d'utilisateur déjà pris" })
            }

            await UserModel.update({ id: req.params.id, username })
            res.json({ message: "Compte mis à jour" })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    // DELETE /api/user/:id — supprimer un compte (admin)
    static async delete(req, res) {
        try {
            // Empêcher l'admin de se supprimer lui-même
            if (parseInt(req.params.id) === req.user.id) {
                return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" })
            }
            await UserModel.delete(req.params.id)
            res.json({ message: "Compte supprimé" })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}