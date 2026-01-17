import { config } from "@/config";
import { authService } from "@/services";
import { UnauthorizedError, ValidationErrors } from "@/utils/errors";
import { createdResponse, successResponse } from "@/utils/response";
import type { Request, Response } from "express";

const cookieOptions = {
  httpOnly: true,
  secure: config.env === "production",
  sameSite: config.env === "production" ? ("none" as const) : ("lax" as const),
  path: "/",
};

export const register = async (req: Request, res: Response) => {
  // service logic will be here

  const result = await authService.registerUser(req.body);

  return createdResponse(res, "User registered successfully", {
    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      isEmailVerified: result.user.isEmailVerified,
      credits: result.user.credits,
      createdAt: result.user.createdAt,
    },
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    throw new ValidationErrors("Validation Error", [
      {
        path: "token",
        message: "Verification token is required",
      },
    ]);
  }

  await authService.verifyUserEmail(token);
  return successResponse(res, "Email verified successfully");
};

export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    throw new ValidationErrors("Validation Error", [
      {
        path: "email",
        message: "Email is required",
      },
    ]);
  }

  // service logic will be here
  await authService.resendVerificationEmail(email);
  return successResponse(res, "Verification email resent successfully");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    throw new ValidationErrors("Validation Error", [
      {
        path: "email",
        message: "Email and password are required",
      },
    ]);
  }

  const { user, accessToken, refreshToken } = await authService.loginUser({
    email,
    password,
  });

  console.log("tokens", { accessToken, refreshToken });

  // save cookies or tokens if needed

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return successResponse(res, "User logged in successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};


export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ValidationErrors("User ID is required");
    }

    const user = await authService.getCurrentUser(userId);

    return successResponse(res, "Current user fetched successfully", {
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            image: user.image,
            role: user.role,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,

        }
    });

}


export const refreshToken = async (req:Request, res:Response) => {

    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    console.log("refresh token:", token);

    if(!token){
        throw new UnauthorizedError("refresh token is required");
    }

    // service logic will be here

    const {accessToken, refreshToken} = await authService.refreshToken(token);

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, "Token refreshed successfully");
}


export const logout = async (req:Request, res:Response) => {

  // get tokens from cookies
  
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!token){
        throw new UnauthorizedError("refresh token is required");
    }


    if(token){
      await authService.logoutUser(req.user!.userId);
    }


    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return successResponse(res, "User logged out successfully");
}