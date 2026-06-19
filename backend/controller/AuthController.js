import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/UserModel.js"

dotenv.config()

const {
    JWT_ALGO: jwtAlgo,
    JWT_SECRET_KEY: jwtSecret,
    JWT_SECRET_REFRESH_KEY: jwtRefreshSecret
} = process.env

export class AuthController {

    static async register(req, res) {

        try {
            // on recupere les données du body de la requete
            const { username, email, password } = req.body

            // on verifie si les donnees sont absentes
            if (
                !username || !email || !password
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

            const isUsernameUsed = await UserModel.findByUsername(username)

            if (isUsernameUsed) {
                res.status(403)
                res.json({
                    message: "Username already in use"
                })
                return
            }

            // on hash le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10)

            // on cree le user en DB
            await UserModel.create({
                username,
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

    static async login(req, res) {

        try {

            // Recuperation de l'email et du password dans le body de la requete 
            const { email, password } = req.body

            // Recuperation de l'utilisateur selon l'email fourni 
            const user = await UserModel.findByEmail(email)

            // Si on n'a pas retrouve l'utilisateur
            // ou
            // si on l'a retrouve mais que le mot de passe fourni ne correspond pas
            // au mot de passe hache stocke en DB
            if (
                !user ||
                !(user && await bcrypt.compare(password, user.password))
            ) {
                // on retourne un message d'erreur "Unauthorized" avec le code statut 401
                res.status(401)
                res.json({ message: "Unauthorized" })
                return;
            }

            const { password: _password, ...publicUser } = user
            const { email: _email, ...cleanUser } = publicUser

            // on genere un token de connexion (payload allégé, sans email)
            const token = jwt.sign(
                { user: cleanUser }, // payload du token
                jwtSecret, // cle secrete qui permet de signer le token
                { // Header du token
                    algorithm: jwtAlgo,
                    expiresIn: 7200
                }
            )

            const refreshtoken = jwt.sign(
                { user: cleanUser }, // payload du token
                jwtRefreshSecret, // cle secrete qui permet de signer le token
                { // Header du token
                    algorithm: jwtAlgo,
                    expiresIn: 3600 * 24 * 7
                }
            )
            // On demande a la reponse de transmettre le token sous forme de cookie
            // qui ne sera transmis qu'avec les requetes HTTP (httpOnly est true)
            // qui sera transmis meme sans SSL/TLS (https)
            // dont l'age maximum est 1h apres sa creation
            res.cookie("token", token, {
                sameSite: "Lax",
                httpOnly: true,
                secure: false,
                maxAge: 7200 * 1000,
                partitioned: false
            })

            res.cookie("refresh_token", refreshtoken, {
                sameSite: "Lax",
                httpOnly: true,
                secure: false,
                maxAge: 3600 * 24 * 7 * 1000,
                partitioned: false
            })
            res.status(200)
            // Envoie d'une reponse qui contient un message et le user complet (sans password)
            res.json({ message: "Authenticated successfuly !", user: publicUser })

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }
    }

    static async refreshToken(req, res) {

        try {

            const { refresh_token } = req.cookies

            try {
                // on verifie si le refresh token est valide
                const decoded = jwt.verify(refresh_token, jwtRefreshSecret)

                const token = jwt.sign(
                    { user: decoded.user }, // payload du token
                    jwtSecret, // cle secrete qui permet de signer le token
                    { // Header du token
                        algorithm: jwtAlgo,
                        expiresIn: 7200
                    }
                )

                res.cookie("token", token, {
                    sameSite: "Lax",
                    httpOnly: true,
                    secure: false,
                    maxAge: 7200 * 1000,
                    partitioned: false
                })

                res.status(200)
                // Envoie d'une reponse qui contient un message
                res.json({
                    message: "Token Refresh"
                })

            } catch (error) {
                res.status(401)
                res.json({ message: "Invalid refresh token" })
            }

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }

    }

    static async me(req, res) {
        try {

            const { token } = req.cookies
            const decoded = jwt.verify(token, jwtSecret)
            const user = await UserModel.findById(decoded.user.id)

            res.status(200)
            res.json({ user })

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }
    }

    static async logout(req, res) {

        try {

            res.cookie("token", "", {
                sameSite: "Lax",
                httpOnly: true,
                secure: false,
                maxAge: 0,
                partitioned: false
            })
            res.cookie("refresh_token", "", {
                sameSite: "Lax",
                httpOnly: true,
                secure: false,
                maxAge: 0,
                partitioned: false
            })

            res.status(200)
            res.json({ message: "Unauthenticated successfully" })

        } catch (error) {
            res.status(500)
            res.json({ message: "Internal Server Error" })
        }
    }

    // Permet à l'utilisateur connecté de modifier son username et/ou son password.
    static async updateAccount(req, res) {
        try {
            const userId = req.user.id
            const { username, password, currentPassword } = req.body

            if (!username && !password) {
                return res.status(400).json({
                    message: "Au moins un champ à modifier est requis (username ou password)"
                })
            }

            // Vérification du mot de passe actuel obligatoire pour toute modification
            const user = await UserModel.findByEmail(req.user.email)
            if (!user || !(await bcrypt.compare(currentPassword ?? "", user.password))) {
                return res.status(401).json({ message: "Mot de passe actuel incorrect" })
            }

            const updateData = { id: userId }

            // Vérification d'unicité du username
            if (username && username !== user.username) {
                const existing = await UserModel.findByUsername(username)
                if (existing) {
                    return res.status(409).json({ message: "Ce nom d'utilisateur est déjà pris" })
                }
                updateData.username = username
            }

            if (password) {
                updateData.password = await bcrypt.hash(password, 10)
            }

            await UserModel.updateAccount(updateData)

            res.status(200).json({ message: "Compte mis à jour avec succès" })

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

}