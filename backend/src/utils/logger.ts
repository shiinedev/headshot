import winston from "winston";
import fs from "fs";
import path from "path";

const loggerDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(loggerDir)) {
  fs.mkdirSync(loggerDir, { recursive: true });
}

const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true })
);
   

const fileFormat = winston.format.combine(baseFormat, winston.format.json());

const consoleFormat = winston.format.combine(
  baseFormat,
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  })
);

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: path.join(loggerDir, "combined.log"),
      level: "info",
      format: fileFormat,
    }),
    //error log file
    new winston.transports.File({
      filename: path.join(loggerDir, "error.log"),
      level: "error",
      format: fileFormat,
    }),
  ],
});
