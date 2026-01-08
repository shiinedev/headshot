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

  async getCreditPackages(): Promise<ICreditPackage[]> {
    const packages = await CreditPackage.find({ isActive: true })
      .sort({ price: 1 })
      .exec();

    return packages 
  }

  async getCreditPackageById(
    packageId: string
  ): Promise< ICreditPackage > {
    const creditPackage = await CreditPackage.findById(packageId).exec();

    if (!creditPackage) {
      throw new NotFoundError("Credit package not found");
    }

    return creditPackage
  }

  // create Order

  async createOrder(input: {
   userId: string;
    packageId: string;
    amount: number;
    credits: number;
    platform: PaymentPlatform;
    phone?: string;
  }): Promise<IOrder> {
    const { amount, packageId, platform, userId ,credits,phone} = input;

    console.log("credits",credits)
    // create order logic
    try {
      const order = await Order.create({
        user: userId,
        package: packageId,
        amount,
        platform,
        status: PaymentStatus.PENDING,
        credits,
      });

      logger.info("Order created successfully", { orderId: order._id });

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

      // update order with session id
      order.stripeSessionId = session.sessionId;
      order.stripePaymentIntentId = session.paymentIntentId;
      order.status = PaymentStatus.PROCESSING;
      await order.save();

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
      const creditPackage = await this.getCreditPackageById(
        packageId
      );

      console.log("creditPackage",creditPackage)

      const totalCredits = creditPackage.credits + (creditPackage.bonus || 0);

      // get user details

      const user = await User.findById(userId).select("email");

      const userEmail = user?.email;

      // create order
     const order = await this.createOrder({ amount: creditPackage.price, packageId, platform, userId,credits: totalCredits, phone });

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


  
async handleSuccessfulPayment(orderId: string,source:"STRIPE" | "LOCAL" | "ADMIN" = "STRIPE"): Promise<void> {

    const order = await Order.findById(orderId);

    if (!order) {
      logger.error("Order not found for successful payment", { orderId });
      throw new NotFoundError("Order not found");
    }

    if(order.creditsAdded){
      logger.info("Credits already added for this order", { orderId });
      throw new AppError("Credits already added for this order",400);
    }

    //TODO:inngest queue to credit user account


  }
}

export const paymentService = new PaymentService();
