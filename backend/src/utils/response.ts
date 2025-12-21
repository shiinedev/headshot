import type { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  meta?: ApiResponse["meta"]
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  };

  return res.status(statusCode).json(response);
};

export const errorResponse = <T>(
  res: Response,
  message: string,
  statusCode: number = 500,
errors?: Record<string, string>[]
): Response => {
  const response: ApiResponse<T> = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  };

  return res.status(statusCode).json(response);
};

export const createdResponse = <T>(
  res: Response,
  message: string,
  data?: T
): Response => {
  return successResponse<T>(res, message, data, 201);
};

export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
}

export const paginatedResponse = <T>(
  res: Response,
  message: string,
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  data?: T
): Response => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const meta = {
    page: pagination.page,
    limit: pagination.limit,
    totalPages,
    total: pagination.total,
  };

  return successResponse(res, message, data, 200, meta);
};
