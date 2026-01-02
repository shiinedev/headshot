import { authService } from "@/services";
import { ValidationErrors } from "@/utils/errors";
import { createdResponse,successResponse } from "@/utils/response";
import type { Request, Response } from "express";


export const register = async (req:Request,res:Response) =>{

    // service logic will be here

    const result = await authService.registerUser(req.body);

   return createdResponse(res,"User registered successfully",{
    user:{
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        isEmailVerified: result.user.isEmailVerified,
        credits: result.user.credits,
        createdAt: result.user.createdAt,
    }
   });

}

export const verifyEmail = async(req:Request,res:Response) => {

    const {token} = req.query;

    if(!token || typeof token !== "string"){
        throw new ValidationErrors("Validation Error",[{
            path: "token",
            message: "Verification token is required",
        }]);
    }

    await authService.verifyUserEmail(token);
    return successResponse(res,"Email verified successfully");

}


export const login = async(req:Request,res:Response) => {

    const result = await authService.loginUser(req.body);
    return successResponse(res,"User logged in successfully",{
        user:{
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            isEmailVerified: result.user.isEmailVerified,
            credits: result.user.credits,
            createdAt: result.user.createdAt,
        }
    });
}