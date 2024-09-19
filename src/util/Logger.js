import dotenv from 'dotenv/config';
import * as winston from "winston";
//import * as morgan from "morgan";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.logLevel_console,
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss:ms' }),
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
        //  winston.format.simple(),
      ),
    }),
  ],
  exitOnError: false,
});

if (process.env.node_env === "dev") {
  logger.add(
    new winston.transports.File({
      level: process.env.logLevel_file,
      filename: process.env.logFile_path,
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
        // winston.format.splat(),
        // winston.format.json()
      ),
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }));
}
logger.info("logging started");