import { save, findByEmail } from "../models/userModel.js";
import { trace } from "@opentelemetry/api";
import argon2 from "argon2";

const tracer = trace.getTracer("backend");

export async function registerUser(email, password) {
    return tracer.startActiveSpan("registerUser", async (span) => {
        try {
            const passwordHash = await tracer.startActiveSpan("hash", async (hashSpan) => {
                try {
                    return await argon2.hash(password);
                } finally {
                    hashSpan.end();
                }
            });

            await save(email, passwordHash);
        } finally {
            span.end();
        }
    });
}

export async function authenticateUser(email, password) {
    return tracer.startActiveSpan("authenticateUser", async (span) => {
        try {
            const userData = await findByEmail(email)

            if (userData == null) {
                let err = new Error("Email not found");
                err.code = 'EMAIL_NOT_FOUND'
                throw err
            }

            const isMatch = await tracer.startActiveSpan("comparePasswordAndHash", async (compareSpan) => {
                try {
                    return await argon2.verify(userData.passwordHash, password)
                } finally {
                    compareSpan.end()
                }
            })
            if (isMatch) {
                return userData
            }

            let err = new Error("wrong password");
            err.code = 'WRONG_PASSWORD'
            throw err
        } finally {
            span.end()
        }
    })
}