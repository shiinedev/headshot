import { inngestClient } from "@/services/queue";
import { AppError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import {Inngest} from "inngest";
import { getCreditAddFunction, type ICreditAdditionData } from "@/services/queue";



export const getInngestClient = ():Inngest =>{
    return inngestClient;
}


export const triggerCreditAddition =async (data:ICreditAdditionData):Promise<void> => {

    try {
        await inngestClient.send({
            name:"payment/add-credits",
            data
        });

        logger.info("Payment success event triggered successfully",{
            userId:data.userId,
            orderId:data.orderId,
            source:data.source,
            credits:data.credits,
        
        });
    } catch (error) {
        logger.error("Error triggering payment success event",error);
        throw new AppError("Error triggering payment success event");
        
    }
}


export const getQueueFunctions = () =>{
    return [
       getCreditAddFunction(),

    ]
}