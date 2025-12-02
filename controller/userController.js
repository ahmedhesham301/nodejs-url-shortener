import { registerUser, authenticateUser } from "../services/userServices.js";

export async function register(req, res) {
    try {
        await registerUser(req.body.email, req.body.password)
        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'Email already exists' })
            return
        }
        else if (error.code == '22001') {
            res.status(400).json({ error: 'Input exceeds allowed length' })
            return
        }
        res.status(500).json({ message: "internal server error" })
        console.error(`error registering user: `, error)
    }
}

export async function login(req, res) {
    try {
        let userData = await authenticateUser(req.body.email, req.body.password)
        req.session.userID = userData.id
        req.session.email = userData.email
        
        res.status(200).json({ message: "login successful"})
    } catch (error) {
        if (error.code == "EMAIL_NOT_FOUND") {
            res.status(400).json({ error: 'Email not found' })
        }
        else if (error.code == "WRONG_PASSWORD") {
            res.status(400).json({ error: 'Invalid password' })
        }
        else {
            res.status(500).json({ message: "internal server error" })
            console.error("error logging in user: ", error)
        }
    }
}