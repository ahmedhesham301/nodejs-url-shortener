import { createClient } from "@redis/client";
import { logger } from "../logger/logger.js";

export const redisClient = await createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    password: process.env.REDIS_PASSWORD
     
})

export async function initRedis() {
    try {
        await redisClient.connect()
    } catch (error) {
        logger.error("Failed to connect to cache.", {
            reason: error.message,
            stack: error.stack
        })
        process.exit(2)
    }
}   