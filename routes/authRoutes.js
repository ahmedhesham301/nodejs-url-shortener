import { Router } from "express";
import { register,login } from "../controller/userController.js";
import { validateBody } from "../middlewares/validation/authValidator.js";
import { sessionMiddleware } from "../middlewares/session.js";

const router = Router();

router.post('/auth/register', validateBody, register)
router.post('/auth/login', validateBody, login)

export default router;