import { createClient } from "@redis/client";
import { logger } from "../logger/logger.js";
import { pool } from "./postgresql.js";
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
        console.log("test");
        
        logger.error("Failed to initialize connection to cache.", {
            reason: error.message,
            stack: error.stack
        })
        process.exit(2)
    }
    redisClient.on("error", (error) => {
        logger.error("redisClient error", {
            reason: error.message,
            code: error.code,
            cause: error.cause,
            stack: error.stack
        })
        pool.end()
        process.exit(2)
    })
}