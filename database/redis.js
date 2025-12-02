import { createClient } from "@redis/client";

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
        console.error("Failed to connect to Redis:", error);
        process.exit(2)
    }
}