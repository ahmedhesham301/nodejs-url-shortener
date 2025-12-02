import { pool } from "../database/postgresql.js";

export async function save(email, passwordHash) {
    const query = {
        name: 'insert-user',
        text: 'INSERT INTO users(email,password_hash) VALUES($1, $2);',
        values: [email, passwordHash]
    }
    await pool.query(query)
    return
}


export async function findByEmail(email) {
    const query = {
        name: 'get-user-by-email',
        text: 'SELECT * FROM users WHERE email = ($1);',
        values: [email]
    }
    const result = await pool.query(query)
    if (result.rowCount == 0) {
        return null
    }
    return {
        id: result.rows[0].id,
        email: result.rows[0].email,
        passwordHash: result.rows[0].password_hash,
        createdAt: result.rows[0].created_at
    }
}

