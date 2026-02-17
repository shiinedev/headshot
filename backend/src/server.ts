import app from "./app.ts";
import { config } from "@/config";
import { connectDB } from "@/db/connection";
import { logger } from "@/utils/logger";

const serverConnect = async () => {
  try {
    //database connection error handling
    await connectDB();

    //start server
    const server = app.listen(config.port, async () => {
      logger.info(`Server is running on port localhost:${config.port}`);
    });

    // Handle server errors
    server.on("error", async (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${config.port} is already in use.`);
        process.exit(1);
      } else {
        logger.error(`Server error: ${error.message}`);
        process.exit(1);
      }
    });
  } catch (error) {
    logger.error(`Unexpected server error: ${error}`);
    process.exit(1);
  }
};

serverConnect();