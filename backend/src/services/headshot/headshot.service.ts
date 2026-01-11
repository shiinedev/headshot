import { Headshot, User } from "@/models";
import { AppError, ValidationErrors } from "@/utils/errors";
import { logger } from "@/utils/logger";
import type mongoose from "mongoose";
import { s3Service } from "@/services/s3";

export const STYLES = {
  professional: {
    name: "Professional",
    description:
      "A formal headshot suitable for corporate profiles and resumes.",
    prompt:
      "A professional headshot of a person in business attire with a neutral background.",
  },
  casual: {
    name: "Casual",
    description:
      "A relaxed headshot perfect for social media and personal branding.",
    prompt:
      "A casual headshot  of a person in everyday clothing with a friendly smile and outdoor background.",
  },
  creative: {
    name: "Creative",
    description:
      "An artistic headshot that showcases personality and creativity.",
    prompt:
      "A creative headshot of a person with vibrant colors, unique lighting, and an artistic background.",
  },
  environmental: {
    name: "Environmental",
    description:
      "A headshot taken in a natural or work-related environment to provide context.",
    prompt:
      "An environmental headshot of a person in their work setting or natural surroundings, highlighting their profession or interests.",
  },
  black_and_white: {
    name: "Black and White",
    description:
      "A classic black and white headshot that emphasizes features and expressions.",
    prompt:
      "A black and white headshot of a person with strong contrast and dramatic lighting.",
  },
};

export type HeadshotStyles = keyof typeof STYLES;

export class HeadshotService {
  getAvailableStyles() {
    return (Object.keys(STYLES) as HeadshotStyles[]).map((key) => ({
      key,
      name: STYLES[key].name,
      description: STYLES[key].description,
    }));
  }

  async generateHeadshot(params: {
    userId: mongoose.Types.ObjectId;
    file: Express.Multer.File;
    styles: HeadshotStyles[];
    customPrompt?: string;
  }) {
    const { userId, file, styles, customPrompt } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new ValidationErrors("User not found");
    }

    const creditsNeeded = styles.length + (customPrompt ? 1 : 0);

    if (user.credits < creditsNeeded) {
      logger.warn(
        `User ${user.email} has insufficient credits to generate headshots. Has ${user.credits}, needs ${creditsNeeded}`
      );
      throw new ValidationErrors(
        `Insufficient credits to generate headshots you have ${user.credits} creditsyou need ${creditsNeeded} credits`
      );
    }

    user.credits -= creditsNeeded;
    await user.save();

    logger.info(
      `User ${user.email} has ${user.credits} credits remaining after deduction of ${creditsNeeded} credits for headshot generation.`
    );

    try {
      // upload file to cloud storage

      const uploadResult = await s3Service.uploadOriginalPhoto(
        user._id.toString(),
        file.buffer,
        file.mimetype
      );

      // get presigned url
        const presignedUrl = await s3Service.getPresignedUrl(uploadResult.key);
        logger.info(`Presigned URL obtained: ${presignedUrl}`);

        // save the headshot request in DB with status 'processing'
        const headshot = await Headshot.create({
            userId: user._id,
            originalPhotoUrl: presignedUrl,
            originalPhotoKey: uploadResult.key,
            selectedStyles: styles,
            processingStartedAt: new Date(),
        })

        // trigger headshot generation process 



    } catch (error) {
        logger.error("Error generating headshot:", error);
        throw new AppError("Failed to generate headshot",500, "HEADSHOT_GENERATION_FAILED");
    }
  }
}

export const headshotService = new HeadshotService();
