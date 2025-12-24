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
};
