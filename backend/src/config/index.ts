

export const config = {
  port: process.env.PORT || 8000,
  database: process.env.NODE_ENV === "production" ? process.env.DATABASE_URL_PRO! : process.env.DATABASE_URL || "mongodb://localhost:27017/headshot",
  env: process.env.NODE_ENV || "development",
  frontend:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:3000",
};
