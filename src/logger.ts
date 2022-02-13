import {
  createLogger as createWinstonLogger,
  config,
  transports,
  format,
  Logger
} from "winston";

interface CreateLoggerOpts {
  customLevels?: config.AbstractConfigSetLevels;
  level?: "standard" | "verbose";
}

const createLogger = ({
  customLevels = config.npm.levels,
  level = "standard"
}: CreateLoggerOpts): Logger => {
  const transport = new transports.Console({
    format: format.combine(format.colorize(), format.cli())
  });

  const logger = createWinstonLogger({
    levels: customLevels,
    level: level === "standard" ? "info" : "verbose",
    transports: [transport],
    exceptionHandlers: [transport]
  });

  return logger;
};

export { createLogger };
