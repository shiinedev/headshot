import { User } from "@/models";
import {
  CreditPackage,
  type ICreditPackage,
} from "@/models/CreditPackage.model";
import { Order, type IOrder } from "@/models/Order.model";
import {
  PaymentPlatform,
  PaymentStatus,
  type PaymentsRequestParams,
  type StripePaymentResponse,
} from "@/types/payment-types";
import { AppError, NotFoundError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { stripeService } from "./stripe.service";

export class PaymentService {
  //Todo: create stripe service

  async getCreditPackages(): Promise<{ packages: ICreditPackage[] }> {
    const packages = await CreditPackage.find({ isActive: true })
      .sort({ price: 1 })
      .exec();

    return { packages };
  }

  async getCreditPackageById(
    packageId: string
  ): Promise<{ package: ICreditPackage }> {
    const creditPackage = await CreditPackage.findById(packageId, {
      isActive: true,
    }).exec();

    if (!creditPackage) {
      throw new NotFoundError("Credit package not found");
    }

    return { package: creditPackage };
  }

  // create Order

  async createOrder(input: {
    amount: number;
    packageId: string;
    platform: PaymentPlatform;
    userId: string;
  }): Promise<IOrder> {
    const { amount, packageId, platform, userId } = input;
    // create order logic
    try {
      const order = await Order.create({
        user: userId,
        package: packageId,
        amount,
        platform,
        status: PaymentStatus.PENDING,
      });

      return order;
    } catch (error) {
      logger.error("Error creating order", error);
      throw new AppError("Error creating order");
    }
  }

  // process Stripe Payment

  async processStripePayment(params: {
    order: IOrder;
    creditPackage: ICreditPackage;
    totalCredits: number;
    successUrl: string;
    cancelUrl: string;
    userEmail?: string;
  }): Promise<StripePaymentResponse> {
    const {
      order,
      creditPackage,
      totalCredits,
      successUrl,
      cancelUrl,
      userEmail,
    } = params;

    try {
      const session = await stripeService.createCheckoutSession({
        amount: order.amount,
        packageId: order.package.toString(),
        cancelUrl,
        credits: totalCredits,
        successUrl,
        userId: order.user.toString(),
        customerEmail: userEmail,
        metadata: {
          orderId: order._id.toString(),
          packageName: creditPackage.name,
        },
      });

      return {
        sessionId: session.sessionId,
        status: PaymentStatus.PROCESSING,
        redirectUrl: session.redirectUrl,
      };
    } catch (error) {
      logger.error("Error processing Stripe payment", error);
      throw new AppError("Error processing Stripe payment");
    }
  }

  async processPayment(params: {
    userId: string;
    packageId: string;
    platform: PaymentPlatform;
    phone?: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<StripePaymentResponse> {
    const {packageId, platform, userId, successUrl, cancelUrl, phone } =
      params;

    try {
      // get package details
      const { package: creditPackage } = await this.getCreditPackageById(
        packageId
      );

      const totalCredits = creditPackage.credits + (creditPackage.bonus || 0);

      // get user details

      const user = await User.findById(userId).select("email");

      const userEmail = user?.email;

      // create order
     const order = await this.createOrder({ amount: creditPackage.price, packageId, platform, userId });

      if (platform === PaymentPlatform.STRIPE) {
        // process Stripe payment
        const result = await this.processStripePayment({
         order,
         creditPackage,
         totalCredits,
         successUrl,
         cancelUrl,
         userEmail
        });

        return result;
      } else if (
        platform === PaymentPlatform.EVC ||
        platform === PaymentPlatform.ZAAD ||
        platform === PaymentPlatform.SAHAL
      ) {
        //Todo: process mobile money payments

        return {
          status: "success",
          sessionId: "",
          paymentIntentId: undefined,
          clientSecret: undefined,
          redirectUrl: undefined,
        };
      } else if (platform === PaymentPlatform.EBIR) {
        //Todo: process ebir payments
        return {
          status: "success",
          sessionId: "",
          paymentIntentId: undefined,
          clientSecret: undefined,
          redirectUrl: undefined,
        };
      } else {
        logger.error("Unsupported payment platform attempted", { platform });
        throw new AppError("Unsupported payment platform");
      }
    } catch (error) {
      logger.error("Error processing payment", error);
      throw new AppError("Error processing payment");
    }
  }
}

export const paymentService = new PaymentService();
