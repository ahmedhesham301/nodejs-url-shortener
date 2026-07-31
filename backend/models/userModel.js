import { pool } from "../database/postgresql.js";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("backend");

export async function save(email, passwordHash) {
    const span = tracer.startSpan("save");
    try {
        const query = {
            name: 'insert-user',
            text: 'INSERT INTO users(email,password_hash) VALUES($1, $2);',
            values: [email, passwordHash]
        }
        await pool.query(query) 
    } finally {
        span.end()
    }
}


export async function findByEmail(email) {
    const span = tracer.startSpan("findByEmail");

    try {
        const query = {
            name: 'get-user-by-email',
            text: 'SELECT * FROM users WHERE email = $1;',
            values: [email]
        }
        const result = await pool.query(query)
        if (result.rowCount === 0) {
            return null
        }
        return {
            id: result.rows[0].id,
            email: result.rows[0].email,
            passwordHash: result.rows[0].password_hash,
            plan: result.rows[0].plan,
            planExpiration: result.rows[0].plan_expiration,
            createdAt: result.rows[0].created_at
        }
    } finally {
        span.end()
    }
    
}

