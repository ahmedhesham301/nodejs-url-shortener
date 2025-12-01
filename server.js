import express from 'express'
import morgan from 'morgan'
import { initDB } from "./database/postgresql.js";
import { initRedis } from "./database/redis.js";
import router from "./routes/urlRoutes.js";

await initDB()
await initRedis()
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(router)




app.listen(8080)