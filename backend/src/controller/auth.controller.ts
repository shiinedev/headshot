import { authService } from "@/services";
import { createdResponse } from "@/utils/response";
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