import dotenv from "dotenv"
import mysql from "mysql2/promise"

dotenv.config()

const { 
    DB_HOST: host,
    DB_PORT: port,
    DB_USER: user,
    DB_PASSWORD: password,
    DB_NAME: database
} = process.env

export const db = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0, 
    enableKeepAlive: true, 
    keepAliveInitialDelay: 0
})