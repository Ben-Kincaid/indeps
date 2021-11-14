interface LogOpts {
  level: "debug" | "info" | "warning" | "error" | "critical";
  msg: any;
}

const defaultLogOpts: LogOpts = {
  level: "info",
  msg: ""
};

class Logger {
  constructor() {}
  log(opts: Partial<LogOpts> = {}): void {
    const extendedOpts: LogOpts = { ...defaultLogOpts, ...opts };

    if (["critical", "error"].includes(extendedOpts.level)) {
      console.error(opts.msg);
      return;
    }

    if (["warning"].includes(extendedOpts.level)) {
      return;
      console.warn(extendedOpts.msg);
    }

    console.log(extendedOpts.msg);
  }
}

const loggerInstance = new Logger();

export default loggerInstance;
