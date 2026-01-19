import { adminService, type OrderPrams } from "@/services";
import type { PaymentPlatform, PaymentStatus } from "@/types/payment-types";
import { ValidationErrors } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { createdResponse, paginatedResponse, successResponse } from "@/utils/response";
import type { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await adminService.getAllUsers();

  return successResponse(res, "Users fetched successfully", users);
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { id: userId } = req.params as { id: string };
  const newRole = req.body.role;

  if (!userId || !newRole) {
    logger.error("User ID and new role are required, Update role aborted.");
    throw new ValidationErrors("User ID and new role are required");
  }

  const user = await adminService.updateUserRole(userId, newRole);

  return successResponse(res, "User role updated successfully", user);
};

export const addUserCredits = async (req: Request, res: Response) => {
  const { id: userId } = req.params as { id: string };
  const creditsToAdd = req.body.credits;

  if (!userId || !creditsToAdd) {
    logger.error(
      "User ID and credits to add are required, Addition credits aborted.",
    );
    throw new ValidationErrors("User ID and credits to add are required");
  }

  const user = await adminService.addUserCredits(userId, creditsToAdd);

  return successResponse(res, "User credits added successfully", user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params as { id: string };

  console.log("request query id:", req.query);

  if (!userId) {
    logger.error("User ID is required for deletion, Deletion aborted.");
    throw new ValidationErrors("User ID is required");
  }

  await adminService.deleteUser(userId);

  return successResponse(res, "User deleted successfully");
};

export const banUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params as { id: string };
  const isBanned = req.body.isBanned;

  console.log("request query id:", req.query);

  if (!userId) {
    logger.error("User ID is required for banning, Ban aborted.");
    throw new ValidationErrors("User ID is required");
  }
  const { user, isBanned: bannedStatus } = await adminService.banUser(
    userId,
    isBanned,
  );

  return successResponse(
    res,
    `${bannedStatus ? "User banned successfully" : "User unbanned successfully"}`,
    { user, bannedStatus },
  );
};

export const getAllOrders = async (req: Request, res: Response) => {

  const {page=1,limit=10,status,platform}  = req.query as OrderPrams


  const data = await adminService.getAllOrders({
    page: Number(page),
    limit: Number(limit),
    status,
    platform
  });

  return successResponse(res, "Orders fetched successfully", data);
};

export const createManualOrder = async (req: Request, res: Response) => {

  const {userId,packageId,credits,amount} = req.body as{
    userId:string;
    packageId:string;
    amount:number;
    credits:number;
  }

  const order = await adminService.createManualOrder(userId,packageId,credits,amount);

  return createdResponse(res, "Manual order created successfully", order);
};

interface orderData {
  _id: string;
  amount: number;
  credits: number;
  creditsAdded: boolean;
  platform: PaymentPlatform;
  status: PaymentStatus;
  package: {
    credits: number;
    name: string;
    price: number;
    _id: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
    isActive: boolean;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
