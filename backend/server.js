// import des dependances tierces
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
// import des elements du projet
import { router } from "./router/index.js"
import { logger } from "./middleware/logger.js"

// ajout des variables d'environnement a `process` 
dotenv.config()

// recuperation des variables d'environnement dans process, par destructuration
const {
    HOST: host,
    PORT: port
} = process.env

const server = express()

// Parsing de cookie
server.use(cookieParser())
server.use(express.json())

// Gestion des CORS
server.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


// Parser automatiquement les donnees de formulaires
server.use(express.urlencoded({ extended: true }))

// Utilisation du middleware logger
server.use(logger)

// on utilise toutes les routes du router
server.use(router)

// on ecoute le port sur l'hote
server.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`)
})

