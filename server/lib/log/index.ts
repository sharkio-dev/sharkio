import { createLogger, transports, format } from "winston";

const log = createLogger({
  transports: [new transports.Console()],
  format: format.combine(format.timestamp(), format.json()),
});

export type Properties = Record<any, any>;

export const useLog = (properties: Properties) => {
  return log.child(properties);
};
