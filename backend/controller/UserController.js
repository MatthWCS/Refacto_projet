import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { UserModel } from "../models/UserModel.js"

dotenv.config()

const { JWT_SECRET_KEY } = process.env

export class UserController {

    static async list(req, res) {

        try {

            const users = await UserModel.findAll()

            res.status(200)
            res.json({
                message: "Users fetched",
                users
            })

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }
    }

    static async one(req, res) {

        try {

            const { id } = req.params
            const user = await UserModel.findById(id)

            res.status(200)
            res.json({
                message: "User fetched",
                user
            })

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }
    }

    static async create(req, res) {

        try {
            // on recupere les données du body de la requete
            const { name, email, password } = req.body

            // on verifie si les donnees sont absentes
            if (
                !name || !email || !password
            ) {
                // si une est absente on revoit une erreure
                res.status(400)
                res.json({
                    message: "All fields are required"
                })
                return
            }

            // on recherche un user avec le mail fournit
            const isEmailUsed = await UserModel.findByEmail(email)

            // s'il est deja utilise on renvoie un message
            if (isEmailUsed) {
                res.status(403)
                res.json({
                    message: "Email already in use"
                })
                return
            }

            // on hash le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10)

            // on cree le user en DB
            await UserModel.create({
                name,
                email,
                password: hashedPassword
            })

            // on confirme la creation par un message
            res.status(201)
            res.json({
                message: "Account created successfully"
            })

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }
    }

    static async update(req, res) {

        try {

            const { data } = req.body

            const { email, password, ...cleanData } = data

            await UserModel.update(cleanData)

            res.status(200)
            res.json({
                message: "User updated successfully"
            })

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }
    }

    static async delete(req, res) {

        try {

            const { id } = req.params

            await UserModel.delete(id)

            res.status(200)
            res.json({ message: "User delete successfully" })

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }
    }
}