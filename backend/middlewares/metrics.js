
import client from "prom-client";

const requestCounter = new client.Counter({
    name: 'url_shortener_http_request_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status_code', 'path']
});

const requestDuration = new client.Histogram({
    name: "url_shortener_http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "status_code", "path"]
});

// client.register.registerMetric(counter)


export async function metricsMiddleware(req, res, next) {
    const end = requestDuration.startTimer();
    res.on('finish', () => {
        const path = req.route?.path ?? req.originalUrl ?? req.url;
        const method = req.method
        const status_code = res.statusCode
        requestCounter.inc({
            method: method,
            status_code: status_code,
            path: path,
        }, 1);
        end({
            method: method,
            status_code: status_code,
            path: path,
        });
    })
    next()

}
