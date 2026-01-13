import { inngestClient } from "@/services/queue";
import { AppError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import {Inngest} from "inngest";
import { getCreditAddFunction, type ICreditAdditionData } from "@/services/queue";
import { getGenerateHeadshotFunction, type GenerateHeadshotEventData } from "./headshot.queue";



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

export const triggerGenerateHeadshot = async (params:GenerateHeadshotEventData):Promise<void> => {

    try {
        await inngestClient.send({
            name:"headshot/generate-headshot",
            data:params,
        });
    } catch (error) {
        logger.error("Error triggering headshot generation event", error);
        throw new AppError("Error triggering headshot generation event");
    }
}


export const getQueueFunctions = () =>{
    return [
       getCreditAddFunction(),
        // Add the headshot generation function to the queue functions
        getGenerateHeadshotFunction(),
    ]
}