import { config } from "@/config";
import { ExternalServiceError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
  apiVersion: config.aws.version,
});

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export class S3Service {
  private bucketName: string;

  constructor() {
    this.bucketName = config.aws.bucketName;
  }

  private generateKey(
    userId: string,
    prefix: string,
    extension: string
  ): string {
    const timestamp = Date.now();
    const randombytes = crypto.randomBytes(6).toString("hex");

    return `${prefix}/${userId}/${timestamp}-${randombytes}.${extension}`;
  }

  async uploadOriginalPhoto(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<UploadResult> {
    try {
      const extension = mimeType.split("/")[1] || "jpg";
      const key = this.generateKey(userId, "headshots", extension);

      // upload to s3 logic
      const putCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      const result = await s3Client.send(putCommand);
      logger.info("S3 upload result:", result);

      const url = `https://${this.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
      logger.info(`File uploaded to S3: ${url}`);

      return {
        url,
        key,
        bucket: this.bucketName,
      };
    } catch (error) {
      logger.error("Error uploading file to S3:", error);
      throw new ExternalServiceError("s3", "Failed to upload file to S3");
    }
  }

  async getPresignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(s3Client, command, {
        expiresIn: expiresInSeconds,
      });
    } catch (error) {
      logger.error("Error generating presigned URL:", error);
      throw new ExternalServiceError("s3", "Failed to generate presigned URL");
    }
  }
}

export const s3Service = new S3Service();
