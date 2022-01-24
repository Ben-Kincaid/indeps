import path from "path";
import fs from "fs";
import { initializeIndeps } from "./api";
import { LockType } from "./api/parsers";
import logger from "./api/logger";

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

const getLockInfo = (): { path: string; type: LockType } => {
  // handle if --f was passed
  if (argv.l) {
    if (argv.l[0] === "/") {
      const exists = fileExist(argv.l);

      if (!exists) {
        logger.log({
          level: "critical",
          msg: `No file found at: ${argv.l}`
        });
        process.exit(1);
      }

      return { path: argv.l, type: "yarn" };
    }
    const relativePath = path.join(process.cwd(), argv.l);
    const exists = fileExist(relativePath);

    if (!exists) {
      logger.log({
        level: "critical",
        msg: `No file found at: ${relativePath}`
      });
      process.exit(1);
    }

    return {
      path: relativePath,
      type: "yarn"
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

    logger.log({
      level: "critical",
      msg: `No file found at: ${argv.l}`
    });
    process.exit(1);
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
        logger.log({
          level: "critical",
          msg: `No file found at: ${argv.l}`
        });
        process.exit(1);
      }
      return { path: argv.pkg };
    }
    const relativePath = path.join(process.cwd(), "./package.json");
    const exists = fileExist(relativePath);
    if (!exists) {
      logger.log({
        level: "critical",
        msg: `No file found at: ${argv.l}`
      });
      process.exit(1);
    }
    return {
      path: relativePath
    };
  }

  const autoPath = path.join(process.cwd(), "./package.json");
  const exists = fileExist(autoPath);
  if (!exists) {
    logger.log({
      level: "critical",
      msg: `No file found at: ${argv.l}`
    });
    process.exit(1);
  }

  return {
    path: autoPath
  };
};

const lock = getLockInfo();

const pkg = getPkgInfo();

initializeIndeps({
  lock: lock,
  pkg: pkg,
  port: argv.p,
  open: argv.open
});
