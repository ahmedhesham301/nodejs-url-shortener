import { Pool } from "pg"

export const pool = new Pool()

export async function initDB() {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS urls (
	  id VARCHAR PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
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
