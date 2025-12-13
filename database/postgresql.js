import { Pool } from "pg"
import { logger } from "../logger/logger.js";

export const pool = new Pool()

export async function initDB() {
    try {
        await pool.connect()
    } catch (error) {
        logger.error({
            message:"error connecting to the db",
            error: error
        })
        process.exit(1)
    }
}
