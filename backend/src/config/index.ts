import { version } from "os";

export const config = {
  port: process.env.PORT || 8000,
  database:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL_PRO!
      : process.env.DATABASE_URL || "mongodb://localhost:27017/headshot",
  env: process.env.NODE_ENV || "development",
  frontend:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:3000",
  email: {
    host: process.env.STMP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.STMP_PORT!) || 587,
    isSecure: process.env.STMP_SECURE === "true" ? true : false,
    user: process.env.STMP_USER || "",
    password: process.env.STMP_PASSWORD || "",
    from: process.env.EMAIL_FROM || "shiinedev96@gmail.com",
  },
  jwt:{
    secret: process.env.JWT_SECRET || "default_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  stripe:{
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },
  aws:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "us-east-1",
    bucketName: process.env.AWS_S3_BUCKET_NAME || "",
    version: process.env.AWS_S3_API_VERSION || "2010-05-15",
  },
  replicate:{
    apiKey: process.env.REPLICATE_API_KEY || "",
  }
};
