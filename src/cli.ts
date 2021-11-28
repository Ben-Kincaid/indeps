import path from "path";
import fs from "fs";
import { initializeIndeps } from "./api";
import { LockType } from "./api/parsers";
import logger from "./api/logger";

// @FIX add logic for automatically detecting lock/package.json
// and for arg overrides

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

const checkIfExists = (filePath: string): boolean => {
  const exists = fs.existsSync(filePath);

  if (!exists) {
    logger.log({
      level: "critical",
      msg: `No file found at: ${filePath}`
    });
    process.exit(1);
  }

  return true;
};

const getLockInfo = (): { path: string; type: LockType } => {
  // handle if --f was passed
  if (argv.l) {
    if (argv.l[0] === "/") {
      checkIfExists(argv.l);
      return { path: argv.l, type: "yarn" };
    }
    const relativePath = path.join(process.cwd(), argv.l);
    checkIfExists(relativePath);

    return {
      path: relativePath,
      type: "yarn"
    };
  }

  // handle auto-detection
  const autoPath = path.join(process.cwd(), "./yarn.lock");
  checkIfExists(autoPath);

  return {
    path: autoPath,
    type: "yarn"
  };
};

const getPkgInfo = (): { path: string } => {
  if (argv.pkg) {
    if (argv.pkg[0] === "/") {
      checkIfExists(argv.pkg);
      return { path: argv.pkg };
    }
    const relativePath = path.join(process.cwd(), "./package.json");
    checkIfExists(relativePath);

    return {
      path: relativePath
    };
  }

  const autoPath = path.join(process.cwd(), "./package.json");
  checkIfExists(autoPath);

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
