import { Router } from "express";
import { createUrl, getUrl } from "../controller/urlController.js";
import { validateBody, validateParams } from "../middlewares/validation/urlValidator.js";
import { isAuthenticated } from "../middlewares/session.js";
const router = Router();

router.post('/create',isAuthenticated ,validateBody, createUrl)
router.get('/:urlId', validateParams,  getUrl)

export default router;