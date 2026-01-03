import { User, type UserRole } from "@/models";
import { tokenService } from "@/services/auth";
import { UnauthorizedError, AppError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.cookies.accessToken;

  if (!token) {
    const authHeaders = req.headers.authorization;

    if (authHeaders?.startsWith("Bearer ")) {
      token = authHeaders.substring(7);
    }
  }

  if (!token) {
    logger.error("Authentication failed: No token provided");
    throw new UnauthorizedError("No authentication token provided");
  }

  try {
    //verify token
    const decoded = tokenService.verifyAccessToken(token, "access");
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError("Token is invalid or user does not exist");
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error("Authentication failed", { error });
    throw new AppError("Authentication Error", 401, "ERR_AUTHENTICATION", true);
  }
};
