import { Headshot } from "@/models";
import { headshotService, STYLES, type HeadshotStyles } from "../headshot";
import { inngestClient } from "./inngest-client";
import { logger } from "@/utils/logger";
import {
  AppError,
  ExternalServiceError,
  ValidationErrors,
} from "@/utils/errors";
import { s3Service } from "../s3";


export interface GenerateHeadshotEventData {
  headshotId: string;
  userId: string;
  originalPhotoUrl: string;
  styles: HeadshotStyles[];
  prompt?: string;
}

export const getGenerateHeadshotFunction =  () => {
  return inngestClient.createFunction(
    {
      id: "generate-headshot",
      retries: 3,
      
    },
    {
      event: "headshot/generate-headshot",
    },
    async ({ event, step }) => {
      const { headshotId, userId, originalPhotoUrl, styles, prompt } =
        event.data as GenerateHeadshotEventData;

      try {
        // step 1 : update headshot status to processing
        await step.run("updating-headshot-status", async () => {
          await Headshot.findByIdAndUpdate(headshotId, {
            status: "processing",
            processingStartedAt: new Date(),
          });

          logger.info(`Headshot ${headshotId} status updated to processing`);
        });

        //step 2 : process headshot generation (call external API or service)

        const headshotResult = await step.run(
          "processing-headshot-generation",
          async () => {
            //check the styles if is array

            if (!Array.isArray(styles)) {
              throw new ValidationErrors("Styles must be an array");
            }

            const stylesArray = styles as HeadshotStyles[];

              if (stylesArray.length === 0 && !prompt?.trim()) {
              throw new ValidationErrors(
                "At least one style or a custom prompt must be provided"
              );
            }

            const stylesToProcess = stylesArray.length > 0 ? stylesArray :[STYLES.professional.name as HeadshotStyles];

            const outputResults = await Promise.all(
              stylesToProcess.map(async (style) => {
                // call service for generating headshot per style
                try {
                  const imageResult = await headshotService.generateHeadshot({
                    style,
                    prompt,
                    imageUrl: originalPhotoUrl,
                  });

                  logger.info(
                    `Headshot generated for style ${style} with URL: ${imageResult.imageUrl}`
                  );

                  return {
                    style,
                    outputUrl: imageResult.imageUrl,
                    status: "success",
                  };
                } catch (error) {
                  logger.error(
                    `❌ Failed to generate ${style} headshot:`,
                    error
                  );
                  return {
                    style,
                    status: "failed",
                    error:
                      error instanceof Error ? error.message : "Unknown error",
                  };
                }
              })
            );

            return outputResults;
          }
        );

        // step3 : upload headshot results to s3 cloud

        const uploadedHeadshots = await step.run(
          "upload-headshot-to-s3",
          async () => {
            const successfulOutputs = headshotResult.filter(
              (output) => output.status === "success"
            ) as Array<{
              style: HeadshotStyles;
              outputUrl: string;
              status: "success";
            }>;

            logger.info(
              `Uploading ${successfulOutputs.length} headshot(s) to S3 for headshot ID: ${headshotId}`
            );

            try {
              const uploaded = await Promise.all(
                successfulOutputs.map(async (output) => {
                  // download image url from replicate
                  const imageBuffer = await s3Service.downloadImageFromUrl(
                    output.outputUrl
                  );

                  // upload to s3
                  const s3UploadResult = await s3Service.uploadToS3(
                    userId,
                    imageBuffer,
                    "image/png",
                    "generated",
                    output.style
                  );

                  logger.info(
                    `Headshot for style ${output.style} uploaded to S3: ${s3UploadResult.url}`
                  );

                  return {
                    url: s3UploadResult.url,
                    key: s3UploadResult.key,
                    style: output.style,
                  };
                })
              );

              return uploaded.filter(
                (u): u is { url: string; key: string; style: HeadshotStyles } =>
                  u !== null
              );
            } catch (error) {
              logger.error("Error uploading headshots to S3", error);
              throw new ExternalServiceError(
                "s3",
                "Failed to upload headshots to S3"
              );
            }
          }
        );

        // step 4 : update headshot document with results and status

        await step.run("update-status-to-completed", async () => {
          if (uploadedHeadshots.length === 0) {
            logger.error(
              "No headshots were successfully generated and uploaded"
            );
            const failedHeadshots = headshotResult
              .filter((h) => h.status == "faile")
              .map((h) => {
                const failed = h as {
                  style: string;
                  status: "failed";
                  error: string;
                };
                return {
                  style: failed.style,
                  error: failed.error || "Unknown error",
                };
              });

            await Headshot.findByIdAndUpdate(headshotId, {
              status: "failed",
              failureReason: `All headshot generations failed. Errors: ${failedHeadshots
                .map((f: any) => `${f.style}: ${f.error}`)
                .join(", ")}`,
              processingCompletedAt: new Date(),
            });
            logger.info(
              `Updated headshot document to failed for headshot ${headshotId} with failure reason: ${`All headshot generations failed. Errors: ${failedHeadshots
                .map((f: any) => `${f.style}: ${f.error}`)
                .join(", ")}`}`
            );
            throw new AppError(
              `All headshot generations failed. Errors: ${failedHeadshots
                .map((f: any) => `${f.style}: ${f.error}`)
                .join(", ")}`,
              500
            );
          }

          await Headshot.findByIdAndUpdate(headshotId, {
            status: "completed",
            generatedHeadshots: uploadedHeadshots.map((h: any) => ({
              styles: h.style,
              url: h.url,
              key: h.key,
              createdAt: new Date(),
            })),
            processingCompletedAt: new Date(),
          });

          logger.info(
            `Updated headshot document to completed for headshot ${headshotId} with ${uploadedHeadshots.length} generated headshots`
          );

          return {
            success: true,
            headshotId,
            generatedCount: uploadedHeadshots.length,
          };
        });
      } catch (error) {
        logger.error(`Failed to generate headshot ${headshotId}:`, error);

        // Update status to failed
        await step.run("update-status-failed", async () => {
          await Headshot.findByIdAndUpdate(headshotId, {
            status: "failed",
            failureReason:
              error instanceof Error ? error.message : "Unknown error",
            processingCompletedAt: new Date(),
          });
        });

        throw new AppError(
          "Failed to generate headshot",
          500,
          "FAILED_TO_GENERATE_HEADSHOT"
        );
      }
    }
  );
};
