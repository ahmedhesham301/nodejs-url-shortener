import { z } from "zod";
import { logger } from "../../logger/logger.js";


const reqBodySchema = z.object({
    url: z.url()
})
const reqParamsSchema = z.string().regex(/^[0-9A-Za-z]+$/);
export async function validateBody(req, res, next) {
    try {
        await reqBodySchema.parseAsync(req.body)
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid URL format", errors: error.errors })
            return
        }
        res.status(500).json({ message: "internal server error" })
        logger.error("error validating request body",{
            reason: error.message,
            stack: error.stack
        })
    }
}

export async function validateParams(req,res,next) {
    try {
        await reqParamsSchema.parseAsync(req.params.urlId)
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid short URL format", errors: error.errors })
            return
        }
        res.status(500).json({ message: "internal server error" })
        logger.error("error validating url request params.", {
            reason: error.message,
            stack: error.stack
        })
    }
}