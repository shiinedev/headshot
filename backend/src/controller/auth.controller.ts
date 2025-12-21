import { authService } from "@/services";
import type { Request, Response } from "express";

export const register = async (req:Request,res:Response) =>{

    // service logic will be here

    const result = await authService.registerUser("hi");

    res.status(201).json(result)

}