import { paymentService, stripeService } from "@/services/payment";
import { ValidationErrors } from "@/utils/errors";
import { successResponse } from "@/utils/response";
import type { Request,Response } from "express";

export const getCreditPackages= async(req:Request, res:Response) =>{



    //service logic call

    const packages = await paymentService.getCreditPackages();

    return successResponse(res,"Credit packages retrieved successfully",packages);

}


export const processPayment= async(req:Request, res:Response) =>{

    // call service

    const userId = req.user?.userId as string;

    if(!userId){
    throw new ValidationErrors("User not authenticated");
    }

    const {platform, packageId, phone, successUrl, cancelUrl} = req.body;

    const paymentResponse = await paymentService.processPayment({
        userId,
        platform,
        packageId,
        phone,
        successUrl,
        cancelUrl
        
    });

    return successResponse(res,"Payment processed successfully",paymentResponse);


}

export const handleStripeWebhook= async(req:Request, res:Response) =>{

    const stripeSignature = req.headers["stripe-signature"] ;

    if(!stripeSignature || typeof stripeSignature !== "string"){
        throw new ValidationErrors("Missing or invalid Stripe signature");
    }

    await stripeService.handleStripeWebhook(req.body, stripeSignature);

}