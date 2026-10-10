import helmet from "helmet";
import express from 'express'
import morgan from 'morgan'
import { initDB } from "./database/postgresql.js";
import { initRedis } from "./database/redis.js";
import urlRouter from "./routes/urlRoutes.js";
import authRouter from "./routes/authRoutes.js"
import { sessionMiddleware } from "./middlewares/session.js";
import { metricsMiddleware } from "./middlewares/metrics.js";
import { register, collectDefaultMetrics } from "prom-client";
import { initKafka } from "./kafka/client.js";

collectDefaultMetrics({ register });
await initDB()
await initRedis()
await initKafka()

const app = express()
app.use(metricsMiddleware)
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))
}
app.disable('x-powered-by')
app.use(helmet());
app.use(express.json())
app.use(sessionMiddleware)
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
})

app.use(authRouter)
app.use(urlRouter)





app.listen(8080, '0.0.0.0')
