import { db } from "../services/database.js"

export class AdventureModel {

    static async findAll() {
        const [rows] = await db.query("SELECT * FROM adventure")
        return rows
    }

    static async findByPk(id) {
        const [rows] = await db.query("SELECT * FROM adventure WHERE id = ?", [id])
        return rows.length ? rows[0] : null
    }

    static async create(data) {
        await db.query("INSERT INTO adventure ( title, description, slug, created_by_user_id,starting_paragraph_id) VALUES (?,?,?,?,?)", [data.title, data.description, data.slug, data.created_by_user_id, data.starting_paragraph_id])
    }

    static async update(data) {

        let sql = "UPDATE adventure SET"

        const values = []

        for (const [prop, value] of Object.entries(data)) {
            if (prop !== "id") {
                sql += `${prop} = ?,`
                values.push(value)
            }
        }

        sql = sql.slice(0, -1)

        sql += " WHERE id = ?"

        values.push(data.id)

        await db.query(sql, values)
    }

    static async remove(id) {
        await db.query("DELETE FROM adventure WHERE id = ?", [id])
    }
}