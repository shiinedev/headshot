import { config } from "@/config";
import { Order } from "@/models/Order.model";
import {
  PaymentStatus,
  type StripePaymentResponse,
} from "@/types/payment-types";
import { AppError, ValidationErrors } from "@/utils/errors";
import { logger } from "@/utils/logger";
import Stripe from "stripe";
import { paymentService } from "./payment.service";

export class StripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = config.stripe.secretKey;

    if (!secretKey) {
      logger.error("Stripe secret key is not configured",secretKey);
      throw new ValidationErrors("Stripe secret key is is required");
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: "2025-12-15.clover",
    });
  }

  async createCheckoutSession(params: {
    userId: string;
    packageId: string;
    amount: number;
    credits: number;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    metadata?: Record<string, any>;
  }): Promise<StripePaymentResponse> {
    // Stripe payment processing logic
    const {
      amount,
      packageId,
      cancelUrl,
      credits,
      successUrl,
      userId,
      metadata,
      customerEmail,
    } = params;

    try {
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${credits} headShot credits`,
                description: `Purchase of ${credits} headShot credits`,
              },
              unit_amount: Math.round(amount * 100), // amount in cents
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          packageId,
          credits: credits.toString(),
          ...metadata,
        },
      };

      if (customerEmail) {
        sessionConfig.customer_email = customerEmail;
      }

      const session = await this.stripe.checkout.sessions.create(sessionConfig);

      if (customerEmail) {
        session.customer_email = customerEmail;
      }

      return {
        status: "success",
        sessionId: session.id,
        paymentIntentId: session.payment_intent as string,
        clientSecret: session.client_secret as string,
        redirectUrl: (session.url as string) || undefined,
      };
    } catch (error) {
      logger.error("Error creating Stripe checkout session", error);
      throw new AppError("Failed to create Stripe checkout session");
    }
  }

  async handleStripeWebhook(
    body: string | Buffer,
    signature: string
  ): Promise<void> {
    const webhookSecret = config.stripe.webhookSecret;
    if (!webhookSecret) {
      logger.error("Stripe webhook secret is not configured");
      throw new ValidationErrors("Stripe webhook secret is is required");
    }

    const event = await this.stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed":
        logger.info("Stripe checkout session completed", {
          event: event.data.object,
          created: event.created,
        });

        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        )
        break;
      case "payment_intent.payment_failed":
        logger.warn("Stripe payment intent failed", {
          eventDate: event.data.object,
          created: event.created,
        });

        break;
      default:
        logger.info("Unhandled Stripe webhook event type", {
          eventType: event.type,
        });
    }
  }

  async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    try {
      let order = await Order.findOne({ stripeSessionId: session.id });

      if (!order && session.metadata?.orderId) {
        order = await Order.findById(session.metadata.orderId);
      }

      if (!order) {
        logger.error(
          `Order not found for Stripe session ID: ${session.id}`
        );
        throw new AppError("Order not found for the completed session", 404);
      }

      if(!order.stripeSessionId){
        order.stripeSessionId = session.id;
      }

      if(!order.stripePaymentIntentId && session.payment_intent){
        order.stripePaymentIntentId = session.payment_intent as string;
      }

      order.save();

      if(session.payment_status === "paid" && order.status !== PaymentStatus.COMPLETED){
        await paymentService.handleSuccessfulPayment(order._id.toString());
      }

    } catch (error) {
      logger.error("Error handling checkout session completed", error);
      throw new AppError("Error handling checkout session completed");
    }
  }
}

export const stripeService = new StripeService();
