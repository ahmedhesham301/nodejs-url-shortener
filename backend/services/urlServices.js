import { trace } from "@opentelemetry/api";
import { redisClient } from "../database/redis.js";

const tracer = trace.getTracer("backend");

export async function getCachedUrl(urlID) {
    return tracer.startActiveSpan("getCachedUrl", async (span) => {
        try {
            const urlRecord = await redisClient.hGetAll(`url:${urlID}`)
            if (Object.keys(urlRecord).length === 0) {
                return null
            }
            return urlRecord
        } finally {
            span.end()
        }
    })
    
}

export async function cacheUrl(urlID, url, monitoring) {
    // await redisClient.set(`url:${urlID}`, url, { expiration: { type: "EX", value: 24 * 60 * 60 } })
    return tracer.startActiveSpan("cacheUrl", async (span) => {
        try {
            await redisClient.hSet(
                `url:${urlID}`,
                {
                    url: url,
                    monitoring: monitoring
                }
            )
            await redisClient.expire(`url:${urlID}`, 24 * 60 * 60);
        } finally {
            span.end()
        }
    })
    
}