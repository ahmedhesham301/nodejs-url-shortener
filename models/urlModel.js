import { pool } from "../database/postgresql.js";

async function save(url) {
    const query = {
        name: 'insert-url',
        text: 'INSERT INTO urls(url) VALUES($1) RETURNING id;',
        values: [url]
    }
    const result = await pool.query(query)
    return result.rows[0].id
}

async function getUrlByID(urlID) {
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
    getUrlByID
}