import express from 'express'
import morgan from 'morgan'
import { initDB } from "./database/postgresql.js";
import { initRedis } from "./database/redis.js";
import urlRouter from "./routes/urlRoutes.js";
import authRouter from "./routes/authRoutes.js"
import { sessionMiddleware } from "./middlewares/session.js";

await initDB()
await initRedis()
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(sessionMiddleware)
app.use(authRouter)
app.use(urlRouter)




app.listen(8080)