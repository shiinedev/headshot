import { Order } from "@/models/Order.model";
import { logger } from "@/utils/logger";

import { User } from "@/models";
import { PaymentStatus } from "@/types/payment-types";
import { NonRetriableError } from "inngest";
import { emailService } from "@/services/notifications"
import { inngestClient } from "@/services/queue";

export interface ICreditAdditionData {
  userId: string;
  orderId: string;
  source: "STRIPE" | "LOCAL" | "ADMIN";
  credits: number;
}

export const getCreditAddFunction = () => {
  return inngestClient.createFunction(
    { id: "credits-add", retries: 3 },
    {
      event: "payment/add-credits",
    },
    async ({ event, step }) => {
      const { credits, orderId, source, userId } =
        event.data as ICreditAdditionData;

      // step 1 validate the order

      const order = await step.run("Validating-order", async () => {
        const order = await Order.findById(orderId);

        if (!order) {
          logger.error("Order not found for credit addition", {
            orderId,
            userId,
          });
          throw new NonRetriableError("Order not found for credit addition");
        }

        if (order.creditsAdded) {
          logger.info("Credits already added for this order", {
            orderId,
            userId,
          });
          return {
            alReadyAdded: true,
            skipped: true,
          };
        }

        return {
          alReadyAdded: false,
          order,
        };
      });

      // step 2 add credits to user account

      const result = await step.run("adding-credits-to-user", async () => {
        const user = await User.findById(userId);

        if (!user) {
          logger.error("User not found for credit addition", {
            userId,
          });
          throw new NonRetriableError("User not found for credit addition");
        }

        const updateOrder = await Order.findById(orderId);

        if (!updateOrder) {
          logger.error("Order not found for updating credit addition", {
            orderId,
            userId,
          });
          throw new NonRetriableError(
            "Order not found for updating credit addition"
          );
        }

        // add credits only if not already added
        const previousBalance = user.credits || 0;
        user.credits += credits;
        await user.save();

        //update the oder and complete it
        updateOrder.creditsAdded = true;
        updateOrder.status = PaymentStatus.COMPLETED;
        await updateOrder.save();

        logger.info("Credits added to user account successfully", {
          userId,
          orderId,
          creditsAdded: credits,
          previousBalance,
          newBalance: user.credits,
        });

        return {
          userId,
          creditsAdded: credits,
          previousBalance,
          newBalance: user.credits,
          skipped: false,
          orderAmount: updateOrder.amount,
          userEmail: user.email,
          userName: user.name,
            orderId: updateOrder._id.toString(),
        };
      });

      // step 3 send notification email to user
      await step.run("sending-notification-email", async () => {
        if (result.skipped) {
          logger.info(
            "Skipping email notification as credits were already added",
            {
              userId,
              orderId,
            }
          );
          return;
        }

        try {
          if (result.userId && result.orderAmount) {
            await emailService.sendCreditAdditionEmail(
              result.userName || "There",
              result.userEmail || "",
              result.creditsAdded,
              result.newBalance,
                result.orderAmount,
                result.orderId

            );
            logger.info("Credit addition email sent successfully", {
              userId,
              orderId,
            });
          } else {
            logger.error("Insufficient data to send credit addition email", {
              userId,
              orderId,
            });
            throw new NonRetriableError(
              "Insufficient data to send credit addition email"
            );
          }
        } catch (error) {
          logger.error("Error sending credit addition email", {
            userId,
            orderId,
          });
          throw new NonRetriableError("Error sending credit addition email");
        }
      });


      return {
        success: true,
        message: "Credits added successfully",
        data:result
      }
    }
  );
};
