import { object } from "zod";
import { redisClient } from "../database/redis.js";

export async function getCachedUrl(urlID) {
    const urlRecord = await redisClient.hGetAll(`url:${urlID}`)
    if (Object.keys(urlRecord).length === 0 ) {
        return null
    }
    return urlRecord
}

export async function cacheUrl(urlID, url, monitoring) {
    // await redisClient.set(`url:${urlID}`, url, { expiration: { type: "EX", value: 24 * 60 * 60 } })
    await redisClient.hSet(
        `url:${urlID}`,
        {
            url: url,
            monitoring: monitoring
        }
    )
    await redisClient.expire(`url:${urlID}`, 24 * 60 * 60);
}