import { incrementDailyViews, incrementHourlyViews, incrementMinutelyViews } from "../models/analyticsModel.js";
import { producer } from "../kafka/client.js";
const viewIncrementers = {
    daily: incrementDailyViews,
    hourly: incrementHourlyViews,
    minutely: incrementMinutelyViews
};
export async function incrementViews(urlId, monitoringType) {
    await producer.send({
        topic: 'url-views',
        messages: [
            {
                key: String(urlId),
                value: JSON.stringify({ monitoringType: monitoringType }),
            },

        ],
    })
}