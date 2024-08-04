import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const corsOptions = {
    // origin: process.env.CORS_ORIGIN,
    origin: "*",
    // origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import cardRouter from "./routes/card.routes.js"
import profileRouter from "./routes/profile.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tagRouter from "./routes/tag.routes.js"
import listRouter from "./routes/list.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/profiles", profileRouter)
app.use("/api/v1/cards", cardRouter)
app.use("/api/v1/tags", tagRouter)
app.use("/api/v1/lists", listRouter)

// http://localhost:8000/api/v1/users/register

export { app }