import { pool } from "../database/postgresql.js";

export async function save(id, userID, url, monitoringType) {
    const query = {
        name: 'insert-url',
        text: 'INSERT INTO urls(id, user_id, url, monitoring) VALUES($1, $2, $3, $4);',
        values: [id, userID, url, monitoringType]
    }
    await pool.query(query)
}

export async function findByID(urlID) {
    const query = {
        name: 'get-url-by-id',
        text: 'SELECT * FROM urls WHERE id = ($1);',
        values: [urlID]
    }
    const result = await pool.query(query)

    if (result.rowCount == 0) {
        return null
    }
    return result.rows[0]
}

export async function getUrlsByUserID(userID) {
    const query = {
        name: 'get-urls-by-user-id',
        text: 'SELECT id,url FROM urls WHERE user_id = ($1);',
        values: [userID]
    }
    const result = await pool.query(query)
    if (result.rowCount == 0) {
        return null
    }
    
    return result.rows
}