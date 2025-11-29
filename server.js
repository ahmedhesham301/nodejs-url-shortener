import express from 'express'
import morgan from 'morgan'
import { initDB } from "./database/postgresql.js";
import router from "./routes/urlRoutes.js";

initDB()
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(router)




app.listen(8080)