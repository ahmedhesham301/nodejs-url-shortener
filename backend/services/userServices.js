    import bcrypt from "bcrypt"
    import { save, findByEmail } from "../models/userModel.js";
    import { trace } from "@opentelemetry/api";

    const tracer = trace.getTracer("backend");

    export async function registerUser(email,password) {
        const span = tracer.startSpan("registerUser");

        const passwordHash = await bcrypt.hash(password, 10);
        await save(email, passwordHash)
        
        span.end()
    }

    export async function authenticateUser(email, password) {
        const userData = await findByEmail(email)

        if (userData == null) {
            let err = new Error("Email not found");
            err.code = 'EMAIL_NOT_FOUND'
            throw  err
        }
        
        if (await bcrypt.compare(password, userData.passwordHash)) {
            return userData
        }

        let err = new Error("wrong password");
        err.code = 'WRONG_PASSWORD'
        throw err
    }