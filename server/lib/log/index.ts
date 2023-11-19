import { createLogger, transports, format } from "winston";
import "dotenv/config";
const logLevel = process.env.LOG_LEVEL;

// Define your custom formatter
const customFormat = format.printf(
  ({ level, message, timestamp, metadata, ...rest }) => {
    const formattedMessage = `[${timestamp}][${level}]: ${message}${
      logLevel === "debug" ? "\n" : ""
    }`;

    return formattedMessage;
  },
);

const log = createLogger({
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL ?? "info",
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.colorize({
      all: true,
    }),
    customFormat,
  ),
});

export type Properties = Record<any, any>;

export const useLog = (properties: Properties) => {
  return log.child(properties);
};
