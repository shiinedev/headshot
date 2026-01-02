import { ValidationErrors } from "@/utils/errors";
import { logger } from "@/utils/logger";
import type { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export const validate = (schema: z.ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const ValidatedData = schema.parse(req.body);

      req.body = ValidatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        logger.error("Validation error", { errors });
        next(new ValidationErrors("Validation Error", errors));
      } else {
        logger.error("Unexpected validation error", { error });
        next(error);
      }
    }
  };
};



export const validateQuery = (schema: z.ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const ValidatedData = schema.parse(req.query);

      Object.assign(req.query, ValidatedData);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));  
        logger.error("Validation error", { errors });
        next(new ValidationErrors("Validation Error", errors));
      } else {
        logger.error("Unexpected validation error", { error });
        next(error);
      }
    }
  };

};