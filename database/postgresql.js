import { Pool } from "pg"

export const pool = new Pool()

export async function initDB() {
    try {
        await pool.connect()
    } catch (error) {
        console.error("error initializing the db: ", error)
        process.exit(1)
    }
}
