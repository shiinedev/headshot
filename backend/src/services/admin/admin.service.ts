import {
  CreditPackage,
  Order,
  User,
  UserRole,
  type IOrder,
  type IUser,
} from "@/models";
import { AppError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { paymentService } from "../payment";
import { PaymentPlatform } from "@/types/payment-types";
import { all } from "better-all";

export interface OrderPrams {
  page?: number;
  limit?: number;
  status?: string;
  platform?: string;
}

export class AdminService {
  async getAllUsers(): Promise<{ users: IUser[]; total: number }> {
    try {
      const users = await User.find().select(
        "-password -verificationToken -verificationTokenExpiry",
      );

      const total = await User.countDocuments();

      return {
        users,
        total,
      };
    } catch (error) {
      logger.error("Error fetching all users:", error);
      throw new AppError("Error fetching users");
    }
  }

  async updateUserRole(userId: string, newRole: UserRole): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true },
      );

      if (!user) {
        throw new AppError("User not found");
      }

      return user;
    } catch (error) {
      logger.error("Error updating user role:", error);
      throw new AppError("Error updating user role");
    }
  }

  async addUserCredits(userId: string, creditsToAdd: number): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { credits: creditsToAdd } },
        { new: true },
      );

      if (!user) {
        throw new AppError("User not found");
      }

      return user;
    } catch (error) {
      logger.error("Error adding user credits:", error);
      throw new AppError("Error adding user credits");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw new AppError("User not found");
      }
    } catch (error) {
      logger.error("Error deleting user:", error);
      throw new AppError("Error deleting user");
    }
  }

  async banUser(
    userId: string,
    isBanned: boolean,
  ): Promise<{ user: IUser; isBanned: boolean }> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: isBanned ? 0 : 1 },
        { new: true },
      );

      if (!user) {
        throw new AppError("User not found");
      }

      return { user, isBanned: !user.isActive };
    } catch (error) {
      logger.error("Error banning user:", error);
      throw new AppError("Error banning user");
    }
  }

  async getAllOrders(
    params: OrderPrams,
  ): Promise<{ orders: IOrder[];
    pagination:{
        page: number;
        limit: number;
        total:number
    } }> {
    const { page = 1, limit = 10, status, platform } = params;
    try {
      const query: any = {};

      if (status) {
        query.status = status;
      }
      if (platform) {
        query.platform = platform;
      }

      const skip = (page - 1) * limit;

      const { orders, total } = await all({
        async orders() {
          return await Order.find(query)
            .populate("user", "name email")
            .populate("package", "name credits price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        },
        async total() {
          return await Order.countDocuments(query);
        },
      });

      return { orders, pagination: { page, limit, total } };
    } catch (error) {
      logger.error("Error fetching all orders:", error);
      throw new AppError("Error fetching orders");
    }
  }

  async createManualOrder(
    userId: string,
    packageId: string,
    credits: number,
    amount: number,
  ): Promise<IOrder> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new AppError("User not found");
      }

      const Package = await CreditPackage.findById(packageId);

      if (!Package) {
        throw new AppError("Credit package not found");
      }

      const order = await paymentService.createOrder({
        userId: user._id.toString(),
        packageId: Package._id.toString(),
        amount,
        credits,
        platform: PaymentPlatform.LOCAL,
        phone: "ADMIN_MANUAL",
      });

      // update user credits
      user.credits += credits;
      await user.save();

      return order;
    } catch (error) {
      logger.error("Error creating manual order:", error);
      throw new AppError("Error creating manual order");
    }
  }
}

export const adminService = new AdminService();
