import bcrypt from "bcrypt"
import { save, findByEmail } from "../models/userModel.js";

export async function registerUser(email,password) {
    const passwordHash = await bcrypt.hash(password, 10);
    await save(email, passwordHash)
    
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