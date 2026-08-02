import { pool } from "../database/postgresql.js";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("backend");

export async function incrementDailyViews(urlId) {
    return tracer.startActiveSpan("incrementDailyViews", async (span) => {
        try {
            const query = {
                name: 'increment-daily-views',
                text: 'INSERT INTO url_daily_views(url_id) VALUES($1) ON CONFLICT (url_id, day) DO UPDATE SET count = url_daily_views.count + 1;;',
                values: [urlId]
            }
            await pool.query(query)
        } finally {
            span.end()
        }
    })
    
}

export async function incrementHourlyViews(urlId) {
    return tracer.startActiveSpan("incrementHorlyViews", async (span) => {
        try {
            const query = {
                name: 'increment-hourly-views',
                text: 'INSERT INTO url_hourly_views(url_id) VALUES($1) ON CONFLICT (url_id, hour) DO UPDATE SET count = url_hourly_views.count + 1;;',
                values: [urlId]
            }
            await pool.query(query)
        } finally {
            span.end()
        }
    })
}

export async function incrementMinutelyViews(urlId) {
    return tracer.startActiveSpan("incrementMinutelyViews", async (span) => {
        try {
            const query = {
                name: 'increment-minutely-views',
                text: 'INSERT INTO url_minutely_views(url_id) VALUES($1) ON CONFLICT (url_id, minute) DO UPDATE SET count = url_minutely_views.count + 1;;',
                values: [urlId]
            }
            await pool.query(query)
        } finally {
            span.end()
        }
    })
}