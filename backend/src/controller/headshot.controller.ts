import { headshotService, type HeadshotStyles } from "@/services/headshot";
import { createdResponse, successResponse } from "@/utils/response";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import {  ValidationErrors } from "@/utils/errors";

export const getAvailableStyles = (req: Request, res: Response) => {
  // Logic to retrieve available headshot styles

  const styles = headshotService.getAvailableStyles();

  return successResponse(
    res,
    "Available headshot styles retrieved successfully",
    styles
  );
};

export const generateHeadshot = async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user?.userId);
  const file = req.file;
  const styles = (req.body.styles || []) as HeadshotStyles[];
  const customPrompt = req.body.prompt as string | undefined;

  console.log("Body:", req.body);

  if (!file) {
    throw new ValidationErrors("No file uploaded");
  }

  if (!styles) {
    throw new ValidationErrors("No styles provided");
  }

  const result = await headshotService.saveOriginalPhoto({
    userId,
    file,
    styles,
    customPrompt,
  });

  return createdResponse(res, "creating headshot Please wait...", result);
};

export const getHeadshots = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { status, limit, offset } = req.query as {
    status?: string;
    limit?: string;
    offset?: string;
  };

  if (!userId) {
    throw new ValidationErrors("User not authenticated");
  }

  const result = await headshotService.getHeadshots({
    userId,
    status,
    limit,
    offset,
  });

  return successResponse(res, "Headshots retrieved successfully", result);
};


export const deleteHeadshot = async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user?.userId);
  const {id} = req.params; 

  if (!userId) {
    throw new ValidationErrors("User not authenticated");
  }

  if(!id){
    throw new ValidationErrors("Headshot id is required");
  }

  const deletedId = await headshotService.deleteHeadshot({
    userId,
    headshotId:id
  });

return successResponse(res, "Headshot deleted successfully", {id:deletedId});


}