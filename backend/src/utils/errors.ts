export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "ERR_INTERNAL_SERVER",
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationErrors extends AppError {
  public readonly errors: Record<string, string>[];

  constructor(message: string ="Validation Error", errors: Record<string, string>[] = []) {
    super(message, 400, "ERR_VALIDATION", true);
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, ValidationErrors.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401, "ERR_UNAUTHORIZED", true);
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, 403, "ERR_FORBIDDEN", true);
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, 404, "ERR_NOT_FOUND", true);
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409, "ERR_CONFLICT", true);
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too Many Requests") {
    super(message, 429, "ERR_RATE_LIMIT", true);
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service Unavailable") {
    super(message, 503, "ERR_SERVICE_UNAVAILABLE", true);
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

export class InsufficientCreditsError extends AppError {
  constructor(message: string = "Insufficient credits") {
    super(message, 402, "INSUFFICIENT_CREDITS");
    Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = "External service error") {
    super(`${service}: ${message}`, 502, "EXTERNAL_SERVICE_ERROR");
    Object.setPrototypeOf(this, ExternalServiceError.prototype);
  }
}

