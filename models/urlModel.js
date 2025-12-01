import { pool } from "../database/postgresql.js";

async function save(id, url) {
    const query = {
        name: 'insert-url',
        text: 'INSERT INTO urls(id,url) VALUES($1, $2);',
        values: [id, url]
    }
    await pool.query(query)
    return
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