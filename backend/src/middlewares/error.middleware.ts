import { config } from "@/config";
import { AppError, ValidationErrors } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { errorResponse } from "@/utils/response";
import type { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
 logger.error("Error Middleware:", {
    message: err.message,
    name: err.name,
    stack: err.stack,
    ...(err instanceof AppError && {
      statusCode: err.statusCode,
      code: err.code,
      isOperational: err.isOperational
    }),
    ...(err instanceof ValidationErrors && {
      validationErrors: err.errors
    })
  });

  if (err instanceof AppError) {
    const validationErrors =
      err instanceof ValidationErrors ? err.errors : undefined;
    return errorResponse(res, err.message, err.statusCode, validationErrors);
  }

  //mongoose validation error handling
  if (err.name === "ValidationError") {
    return errorResponse(res, "Validation failed", 400);
  }

  //mongoose duplicate key error handling
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    return errorResponse(res, "Duplicate key error", 400);
  }

  //jwt error handling
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, "Invalid token", 401);
  }

  // token expired error handling
  if (err.name === "TokenExpiredError") {
    return errorResponse(res, "Token expired", 401);
  }

  const message =
    config.env === "development" ? err.message : "Internal Server Error";
  return errorResponse(res, message, 500);
};
