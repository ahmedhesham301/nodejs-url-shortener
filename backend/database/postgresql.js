import { Pool } from "pg"
import { logger } from "../logger/logger.js";

export const pool = new Pool()

export async function initDB() {
    try {
        await pool.query("SELECT now()")
        
    } catch (error) {
        logger.error("Failed to initialize connection to db.", {
            reason: error.message,
            code: error.code,
            stack: error.stack
        })
        process.exit(1)
    }
    pool.on("error", (error) => {
        logger.error("PostgreSQL pool error", {
            reason: error.message,
            code: error.code,
            stack: error.stack
        })
        process.exit(1)
    })
}


