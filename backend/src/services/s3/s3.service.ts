import { config } from "@/config";
import { AppError, ExternalServiceError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import {
  DeleteObjectCommand,
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

  async uploadToS3(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string,
     type: "generated" | "originals",
    style?: string,
  ): Promise<UploadResult> {
    try {
      const extension = mimeType.split("/")[1] || "jpg";
      const key = this.generateKey(userId, `${type  === "originals" ? "originals" : `generated/${style}`}`, extension);

      logger.info(`Uploading file to S3 with key: ${key} with type: ${type} and style: ${style} and mimeType: ${mimeType}`);
      // upload to s3 logic
      const putCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        Metadata:{
          userId,
          updateAt:new Date().toISOString(),
          type
        }
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

  async downloadImageFromUrl(url: string): Promise<Buffer> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new AppError("Failed to download image", response.status);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error) {
        logger.error("Error downloading image from URL:", error);
        throw new AppError("Failed to download image from URL");
        
    }
  }

  async deletePhotoByKey(key: string): Promise<void> {
    if(!key || key.trim() === ""){
      logger.warn("Empty key provided for deletion");
      throw new AppError("Invalid S3 key provided for deletion");
    }

    try {
        const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await s3Client.send(deleteCommand);
    logger.info(`File with key ${key} deleted from S3`);
    } catch (error) {
      logger.error("Error deleting file from S3:", error);
      throw new ExternalServiceError("s3", "Failed to delete file from S3");
    }


  }

  async deleteFromS3(keys: string[]): Promise<void> {
    try {

      const deletedPromise = keys.map((key) => this.deletePhotoByKey(key));

      await Promise.all(deletedPromise);

      logger.info(`Files with keys ${keys.join(", ")} deleted from S3`);
      
    } catch (error) {
      logger.error("Error deleting files from S3:", error);
      throw new ExternalServiceError("s3", "Failed to delete files from S3");
    }
  }
}

export const s3Service = new S3Service();
