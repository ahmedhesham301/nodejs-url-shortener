import { incrementDailyViews,incrementHourlyViews,incrementMinutelyViews } from "../models/analyticsModel.js";
const viewIncrementers = {
    daily: incrementDailyViews,
    hourly: incrementHourlyViews,
    minutely: incrementMinutelyViews
};
export async function incrementViews(urlId, monitoringType) {
    viewIncrementers[monitoringType](urlId, monitoringType)
}