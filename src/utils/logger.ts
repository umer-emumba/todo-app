import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFolder = path.join(__dirname, "./../../logs"); // Change 'logs' to your desired folder name

const configureLogger = (): winston.Logger => {
  return winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new DailyRotateFile({
        filename: path.join(logFolder, "application-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d", // keep logs for 14 days
        level: "info",
      }),
    ],
    exceptionHandlers: [
      new DailyRotateFile({
        filename: path.join(logFolder, "exceptions-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d", // keep logs for 14 days
        level: "error",
      }),
    ],
    rejectionHandlers: [
      new DailyRotateFile({
        filename: path.join(logFolder, "rejections-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d", // keep logs for 14 days
        level: "error",
      }),
    ],
    exitOnError: false, //dont exit on error
  });
};

// Export a singleton instance of the logger
export const logger = configureLogger();
