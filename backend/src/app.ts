import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "@/config";
import v1Routes from "@/router/v1";
import { errorMiddleware } from "@/middlewares";
import { errorResponse } from "@/utils/response";

const app = express();

// cors middleware
app.use(
  cors({
    origin: config.frontend,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "cookie",
      "stripe-signature",
    ],
  })
);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

//routes

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "server is running",
    timeStamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/v1", v1Routes);

// 404 not found handler
app.use((req, res, next) => {
  return errorResponse(res, "Route not found", 404, [
    {
      path: req.originalUrl,
      message: "route not found",
    },
  ]);
});

// global error handler

app.use(errorMiddleware);


export default app;