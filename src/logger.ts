import {
  createLogger as createWinstonLogger,
  config,
  transports,
  format,
  Logger,
  addColors
} from "winston";

interface CreateLoggerOpts {
  levels?: config.AbstractConfigSetLevels;
  colors?: config.AbstractConfigSetColors;
  level?: string;
}

const defaultColors = {
  error: "bold red",
  warn: "underline yellow",
  info: "green",
  verbose: "dim gray",
  debug: "magenta",
  silly: "cyan redBG"
};

const createLogger = ({
  levels = config.npm.levels,
  colors = defaultColors,
  level = "info"
}: CreateLoggerOpts): Logger => {
  const myCustomFormat = format.combine(
    format.colorize({
      all: true
    }),
    format.simple(),
    format.label({
      label: "\x1b[2mindeps\x1b[0m"
    }),
    format.printf(
      ({ level, message, label }) =>
        `[${label}] \x1b[2m${level}\x1b[0m: ${message}`
    )
  );

  const transport = new transports.Console({
    format: format.combine(myCustomFormat)
  });

  const logger = createWinstonLogger({
    levels: levels,
    level: level,
    transports: [transport],
    exceptionHandlers: [transport]
  });

  addColors(colors);

  return logger;
};

export { createLogger };
