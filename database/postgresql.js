import { Pool } from "pg"
import { logger } from "../logger/logger.js";

export const pool = new Pool()

export async function initDB() {
    try {
        await pool.connect()
    } catch (error) {
        logger.error("Failed to connect to db.", {
            reason: error.message,
            stack: error.stack
        })
        process.exit(1)
    }
}
