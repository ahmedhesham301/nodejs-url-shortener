import { Pool } from "pg"
import { logger } from "../logger/logger.js";

export const pool = new Pool()

export async function initDB() {
    pool.on("error", (err) => {
        logger.error("PostgreSQL pool error", {
            reason: err.message,
            code: err.code,
            cause: err.cause,
            stack: err.stack
        })
    })
    try {
        await pool.query("SELECT now()")
    } catch (error) {
        logger.error("Failed to connect to db.", {
            reason: error.message,
            stack: error.stack
        })
        process.exit(1)
    }
}


