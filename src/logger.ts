import winston, {
  createLogger as createWinstonLogger,
  addColors,
  transports
} from "winston";

interface CreateLoggerOpts {
  customLevels?: winston.config.AbstractConfigSetLevels;
  level: any;
}

const createLogger = ({
  customLevels = winston.config.npm.levels,
  level = "info"
}: CreateLoggerOpts): winston.Logger => {
  const transport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.cli()
    )
  });

  const logger = createWinstonLogger({
    levels: customLevels,
    level,
    transports: [transport],
    exceptionHandlers: [transport]
  });

  return logger;
};

export { createLogger };
