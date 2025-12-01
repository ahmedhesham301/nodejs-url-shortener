import { redisClient } from "../database/redis.js";

export async function getCachedUrl(urlID) { 
    const url =  await redisClient.get(urlID)
    return url
}

export async function cacheUrl(urlID, url) {
    await redisClient.set(urlID, url, { expiration: { type: "EX", value: 60 } })
}