import { Router } from "express";
import { createUrl, getUrl } from "../controller/urlController.js";
import { validateBody, validateParams } from "../middlewares/validator.js";
const router = Router();

router.post('/create', validateBody, createUrl)
router.get('/:urlId', validateParams,  getUrl)

export default router;