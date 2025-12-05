import { redisClient } from "../database/redis.js";

export async function getCachedUrl(urlID) {
    const url = await redisClient.get(`url:${urlID}`);
    return url
}

export async function cacheUrl(urlID, url) {
    await redisClient.set(`url:${urlID}`, url, { expiration: { type: "EX", value: 24 * 60 * 60 } })
}