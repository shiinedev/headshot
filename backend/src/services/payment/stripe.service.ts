import { config } from "@/config";
import type { PaymentsRequestParams, StripePaymentResponse } from "@/types/payment-types";
import { AppError, ValidationErrors } from "@/utils/errors";
import { logger } from "@/utils/logger";
import Stripe from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = config.stripe.secretKey;

    if (!secretKey) {
      logger.error("Stripe secret key is not configured");
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
        redirectUrl: session.url as string || undefined,
      };
    } catch (error) {
        logger.error("Error creating Stripe checkout session", error);
        throw new AppError("Failed to create Stripe checkout session");
    }
  }
}


export const stripeService = new StripeService();