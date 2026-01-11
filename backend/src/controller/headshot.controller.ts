import { headshotService, type HeadshotStyles } from "@/services/headshot";
import { createdResponse, successResponse } from "@/utils/response";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ValidationErrors } from "@/utils/errors";
import { custom } from "zod";
import { User } from "@/models";
import { logger } from "@/utils/logger";
import { s3Service } from "@/services";




export const getAvailableStyles = (req:Request, res:Response) => {
    // Logic to retrieve available headshot styles

    const styles = headshotService.getAvailableStyles();

    return successResponse(res,"Available headshot styles retrieved successfully", styles);
}


export const generateHeadshot = async (req:Request, res:Response) => {

    const userId = new mongoose.Types.ObjectId(req.user?.userId);
    const file = req.file;
    const styles = req.body.styles  as HeadshotStyles[];
    const customPrompt = req.body.customPrompt as string | undefined;

    if(!file){
        throw new ValidationErrors("No file uploaded");
    }

    const result = await headshotService.generateHeadshot({
        userId,
        file,
        styles,
        customPrompt,
    });

    return createdResponse(res,"creating headshot Please wait...", result);

}