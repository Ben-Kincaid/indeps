import path from "path";
import fs from "fs";
import { initializeIndeps } from "./api";
import { LockType } from "./api/parsers";
import { createLogger } from "./logger";
import winston, { loggers } from "winston";
import Transport from "winston-transport";
import { LockInfo, PkgInfo } from "src";
import { Console } from "winston/lib/winston/transports";
import { IndepsError } from "src/error";

const argv = require("yargs")
  .scriptName("indeps")
  .usage("Usage: $0 [options]")
  .help("h")
  .alias("h", "help")
  .alias("l", "lock")
  .nargs("l", 1)
  .describe(
    "l",
    "The yarn.lock to use for the visualization. Defaults to yarn.lock in current directory."
  )
  .alias("p", "port")
  .nargs("p", 1)
  .describe("p", "The port used to serve the visualizer client.")
  .nargs("pkg", 1)
  .describe(
    "pkg",
    "the package.json to use for the visualization. Defaults to package.json in current directory."
  )
  .boolean("no-open")
  .describe("no-open", "Disable opening of browser on server start.").argv;

const fileExist = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

const getLockTypeFromPath = (path: string): LockType | null => {
  if (path.endsWith("yarn.lock")) return "yarn";
  if (path.endsWith("package-lock.json")) return "npm";
  return null;
};

const getLockInfo = (): { path: string; type: LockType } => {
  // handle if --l was passed
  if (argv.l) {
    const expLockType = getLockTypeFromPath(argv.l);
    if (!expLockType) {
      throw new IndepsError(
        `"${argv.l}" is not a valid lockfile. Please specify a yarn.lock or package-lock.json file.`
      );
    }

    if (argv.l[0] === "/") {
      const exists = fileExist(argv.l);

      if (!exists) {
        throw new IndepsError(`No file found at: ${argv.l}`);
      }

      return { path: argv.l, type: expLockType };
    }
    const relativePath = path.join(process.cwd(), argv.l);
    const exists = fileExist(relativePath);

    if (!exists) {
      throw new IndepsError(`No file found at: ${relativePath}`);
    }

    return {
      path: relativePath,
      type: expLockType
    };
  }

  // handle auto-detection
  let autoPath = path.join(process.cwd(), "./yarn.lock");
  let autoType = "yarn";

  const autoYarnExists = fileExist(autoPath);

  if (!autoYarnExists) {
    const autoPkgPath = path.join(process.cwd(), "./package-lock.json");
    const autoPkgExists = fileExist(autoPkgPath);

    if (autoPkgExists) return { type: "npm", path: autoPkgPath };

    throw new IndepsError(
      `No lockfile could be found automatically in your current working directory, and there was no \`--l\` flag passed. Please use indeps in a project directory with a valid lockfile & package.json, or explicitly specify the files with \`--l\` and \`--pkg\`.`
    );
  }

  return {
    path: autoPath,
    type: "yarn"
  };
};

const getPkgInfo = (): { path: string } => {
  if (argv.pkg) {
    if (argv.pkg[0] === "/") {
      const exists = fileExist(argv.pkg);
      if (!exists) {
        throw new IndepsError(`No file found at: ${argv.l}`);
      }
      return { path: argv.pkg };
    }
    const relativePath = path.join(process.cwd(), "./package.json");
    const exists = fileExist(relativePath);
    if (!exists) {
      throw new IndepsError(`No file found at: ${argv.l}`);
    }
    return {
      path: relativePath
    };
  }

  const autoPath = path.join(process.cwd(), "./package.json");
  const exists = fileExist(autoPath);
  if (!exists) {
    throw new IndepsError(`No file found at: ${argv.l}`);
  }

  return {
    path: autoPath
  };
};

class ErrorTransport extends Console {
  ogLog: any;
  constructor(opts: any) {
    super(opts);
    this.ogLog = super.log;
  }

  log(info: any, callback: any) {
    this.ogLog(info, callback);
  }
}

(async () => {
  const logger = createLogger({
    level: "info",
    customLevels: winston.config.cli.levels
  });

  // start indeps
  try {
    // get lockfile info
    const lock = getLockInfo();

    // get package.json info
    const pkg = getPkgInfo();

    await initializeIndeps({
      lock: lock!,
      pkg: pkg!,
      port: argv.p,
      open: argv.open,
      logLevel: "standard"
    });
  } catch (error) {
    if (error instanceof IndepsError) {
      logger.error(error.message);
    } else if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error(error);
    }
  }
})();
