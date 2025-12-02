import { pool } from "../database/postgresql.js";

async function save(id, userID,url) {
    const query = {
        name: 'insert-url',
        text: 'INSERT INTO urls(id, user_id,url) VALUES($1, $2, $3);',
        values: [id, userID, url]
    }
    await pool.query(query)
    return
}

async function findByID(urlID) {
    const query = {
        name: 'get-url-by-id',
        text: 'SELECT * FROM urls WHERE id = ($1);',
        values: [urlID]
    }
    const result = await pool.query(query)
    // console.log(result);

    if (result.rowCount == 0) {
        return null
    }
    return result.rows[0].url
}

export default {
    save,
    findByID
}