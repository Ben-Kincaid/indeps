import path from "path";
import fs from "fs";
import startIndeps from "./api";
import { LockType } from "./api/parsers";
import logger from "./api/logger";

// @FIX add logic for automatically detecting lock/package.json
// and for arg overrides

const argv = require("yargs")
  .scriptName("indeps")
  .usage("Usage: $0 [options]")
  .help("h")
  .alias("h", "help")
  .alias("f", "file")
  .nargs("f", 1)
  .describe(
    "f",
    "The yarn.lock to use for the visualization. Defaults to yarn.lock in current directory."
  )
  .alias("p", "port")
  .nargs("p", 1)
  .describe("p", "The port used to serve the visualizer client.").argv;

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
  if (argv.f) {
    if (argv.f[0] === "/") {
      checkIfExists(argv.f);
      return { path: argv.f, type: "yarn" };
    }
    const relativePath = path.join(process.cwd(), argv.f);
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

const lock = getLockInfo();

startIndeps({
  lock: lock,
  port: argv.p || 8008
});
