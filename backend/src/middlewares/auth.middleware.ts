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
): Promise<void> => {
  try {
    let token = req.cookies?.accessToken; 

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
    throw new UnauthorizedError("Unauthorized access");
  }
};


export const authorize = (...roles: UserRole[]) => {
  return async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId; 
      
      if(!userId){
        logger.error("Authorization failed: No user ID found in request");
        throw new UnauthorizedError("You do not have permission to access this resource");
      }

      const user = await User.findById(userId);

      if(!user){
        logger.error("Authorization failed: User not found");
        throw new UnauthorizedError("You do not have permission to access this resource");
      }

      if (!user.role || !roles.includes(user.role)) {
        logger.error("Authorization failed: Insufficient permissions");
        throw new UnauthorizedError("You do not have permission to access this resource");
      }
      next();
    } catch (error) { 
      logger.error("Authorization failed", { error });
      throw new UnauthorizedError("You do not have permission to access this resource");
    }
  };
};