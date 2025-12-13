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
        logger.error({
            message: "Failed to connect to Redis",
            error: error
        })
        process.exit(2)
    }
}