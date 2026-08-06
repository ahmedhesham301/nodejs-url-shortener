import { incrementDailyViews,incrementHourlyViews,incrementMinutelyViews } from "../models/analyticsModel.js";
const viewIncrementers = {
    daily: incrementDailyViews,
    hourly: incrementHourlyViews,
    minutely: incrementMinutelyViews
};
export async function incrementViews(urlId, monitoringType) {
    await viewIncrementers[monitoringType](urlId, monitoringType)
}