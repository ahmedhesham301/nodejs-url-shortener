import { Pool } from "pg"

export const pool = new Pool()

export async function initDB() {
    const query = `CREATE TABLE IF NOT EXISTS urls (
	  id VARCHAR PRIMARY KEY,
	  url VARCHAR NOT NULL
	);
    `
    try {
        await pool.query(query)
    } catch (error) {
        console.error("error initializing the db: ", error)
        process.exit(1)
    }
}
