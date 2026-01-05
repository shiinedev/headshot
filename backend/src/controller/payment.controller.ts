import { paymentService } from "@/services/payment";
import { successResponse } from "@/utils/response";
import type { Request,Response } from "express";

export const getCreditPackages= async(req:Request, res:Response) =>{



    //service logic call

    const packages = await paymentService.getCreditPackages();

    return successResponse(res,"Credit packages retrieved successfully",packages);

}


export const processPayment= async(req:Request, res:Response) =>{

    // call service

    const {} = req.body;


}