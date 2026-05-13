import express, { type Application, type Request, type Response, } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import { env } from "./config/env.js"

import { errorMiddleware } from "./middlewares/error.middleware.js"

const app: Application = express()

app.use(express.json({ limit: '12kb' }))

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())


const allowedOrigins =
    env.nodeEnv === 'production'
        ? ["https://ai-spend-audit-assignment.vercel.app"]
        : [
            'http://localhost:3000',
            "https://ai-spend-audit-assignment.vercel.app",
            'http://localhost:5173',
        ]

app.use(
    cors({
        origin: allowedOrigins,

        credentials: true,

        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],

        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

import auditRoutes from "./routes/audit.route.js";
import leadRouter from "./routes/lead.route.js";
import summaryRoutes from "./routes/summaryRoutes.js";

app.use("/api/v1/audit", auditRoutes);
app.use("/api/v1/lead", leadRouter);
app.use("/api/summary", summaryRoutes);


app.get('/', (_req: Request, res: Response) => {
    return res.status(200).json({
        success: true,

        message: 'API is running',

        docs: '/api-docs',
    })
})

// ======================================
// 404 HANDLER
// ======================================

app.use((req: Request, res: Response) => {
    return res.status(404).json({
        success: false,

        message: `Route not found: ${req.originalUrl}`,
    })
})

// ======================================
// GLOBAL ERROR MIDDLEWARE
// ======================================

app.use(errorMiddleware)

export default app