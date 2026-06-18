import { db } from "../services/database.js";

// -------------------------------------------------------
// UserModel
// Responsabilité : accès BDD aux utilisateurs
// -------------------------------------------------------
export class UserModel {

    static async findAll() {
        const [rows] = await db.query(`SELECT * FROM user`);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM user WHERE id = ?`,
            [id]
        );
        return rows[0] ?? null;
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            `SELECT * FROM user WHERE email = ?`,
            [email]
        );
        return rows[0] ?? null;
    }

    static async create(data) {
        await db.query(
            `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`,
            [data.username, data.email, data.password]
        );
    }

    /**
     * Met à jour un utilisateur par son id.
     * Toutes les propriétés de data sauf id sont mises à jour.
     * @param {{ id: number, [key: string]: any }} data
     */
    static async update(data) {
        const fields = Object.keys(data).filter(k => k !== "id");

        if (!fields.length) return;

        const sql = `UPDATE user SET ${fields.map(f => `${f} = ?`).join(", ")} WHERE id = ?`;
        const values = [...fields.map(f => data[f]), data.id];

        await db.query(sql, values);
    }

    static async delete(id) {
        await db.query(`DELETE FROM user WHERE id = ?`, [id]);
    }
}