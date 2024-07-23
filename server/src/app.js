import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import cardRouter from "./routes/card.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/card", cardRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)

// http://localhost:8000/api/v1/users/register

export { app }