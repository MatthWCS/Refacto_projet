import { db } from "../services/database.js";

// -------------------------------------------------------
// UserModel
// Responsabilité : accès BDD aux utilisateurs
// -------------------------------------------------------
export class UserModel {

    static async findAll() {
        const [rows] = await db.query(
            `SELECT id, username, email, is_admin, created_at, updated_at FROM user`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT id, username, email, is_admin, created_at, updated_at 
            FROM user WHERE id = ?`,
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

    static async findByUsername(username) {
        const [rows] = await db.query(
            `SELECT id FROM user WHERE username = ?`,
            [username]
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
     * Mise à jour du compte par l'utilisateur lui-même.
     * Seuls username et password sont modifiables.
     * Le password doit être déjà hashé avant l'appel.
     * @param {{ id: number, username?: string, password?: string }} data
     */

    static async updateAccount(data) {
        const allowed = ["username", "password"];
        const fields = Object.keys(data).filter(k => allowed.includes(k));
        if (!fields.length) return;

        const sql = `UPDATE user SET ${fields.map(f => `${f} = ?`).join(", ")} WHERE id = ?`;
        const values = [...fields.map(f => data[f]), data.id];
        await db.query(sql, values);
    }

    /**
     * Met à jour d'un utilisateur par son id.
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