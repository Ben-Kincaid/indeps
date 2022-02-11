interface LogOpts {
  level: "debug" | "info" | "warning" | "error" | "critical";
  msg: any;
}

const defaultLogOpts: LogOpts = {
  level: "info",
  msg: ""
};

/**
 * Base class for global logger.
 *
 * @remarks
 * The core class responsible for logging throughout indeps; both for development purposes and for stdout to the user.
 *
 * @returns a logger instance
 *
 * @internal
 */
class Logger {
  /**
   * Log a value to a target source.
   *
   * @remarks
   * Log a value to a target source.
   *
   * @param opts - The log message options
   * @returns void
   */
  log(opts: Partial<LogOpts> = {}): void {
    const extendedOpts: LogOpts = { ...defaultLogOpts, ...opts };

    if (["critical", "error"].includes(extendedOpts.level)) {
      console.error(opts.msg);
      return;
    }

    if (["warning"].includes(extendedOpts.level)) {
      console.warn(extendedOpts.msg);
      return;
    }

    console.log(extendedOpts.msg);
  }
}

const loggerInstance = new Logger();

export default loggerInstance;
