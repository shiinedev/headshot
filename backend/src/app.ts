import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "@/config";
import v1Routes from "@/router/v1";
import { errorMiddleware } from "@/middlewares";
import { errorResponse } from "@/utils/response";
import { paymentController } from "./controller";
import { inngestRoutes } from "@/router/innges.route";
import { apiRateLimitConfig } from "./middlewares/rateLimit";
import compression from "compression";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'"],
        // connectSrc:["'self'",
        //    "https://api.stripe.com",
        //    "https://replicate.com",
        //     config.frontend,
        //   ],
        frameSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

// compression middleware
app.use(compression());

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
  }),
);

// stripe middleware

app.post(
  "/api/v1/payment/webhook/stripe",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook,
);

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
app.use(cookieParser());

//routes

app.get("/health", apiRateLimitConfig.general, (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "server is running on healthy mode",
    timeStamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
    env: config.env,
  });
});

app.use("/api/v1", v1Routes);
app.use("/api/inngest", inngestRoutes);

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
