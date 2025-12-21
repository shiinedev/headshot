import mongoose from "mongoose";
import { config } from "@/config";
import { logger } from "@/utils/logger";


export const connectDB = async():Promise<void> =>{

    try{
        await mongoose.connect(config.database);
        logger.info("Database connected successfully");

    }catch(error){
        logger.error("Database connection failed:", error);
        process.exit(1);
    }
    
};

mongoose.connection.on("error", (err) =>{
    logger.error("MongoDB connection error:", err);
    process.exit(1);
});

mongoose.connection.on("disconnected", () =>{
    logger.warn("MongoDB disconnected. Attempting to reconnect...");
    connectDB();

})