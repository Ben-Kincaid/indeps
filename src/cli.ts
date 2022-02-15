import path from "path";
import fs from "fs";

import { config } from "winston";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import createDependencyGraph from "src/utils/createDependencyGraph";
import { IndepsError } from "src/error";
import getIndepsPkg from "src/utils/getIndepsPkg";
import {parseLock, parsePkg, LockType } from "src/parsers";
import createDependencyData from "src/utils/createDependencyData";
import Viewer from "src/viewer";
import fileExist from "src/utils/fileExists";
import getLockTypeFromPath from "src/utils/getLockTypeFromPath";

import { createLogger } from "./logger";

/** Initialize interactive CLI tool */
const argv = yargs(hideBin(process.argv))
  .scriptName("indeps")
  .option("lock", {
    alias: "l",
    type: "string",
    description:
      "Path to the yarn.lock to use for the visualization. Defaults to yarn.lock in current directory."
  })
  .option("pkg", {
    type: "string",
    description:
      "Path to the package.json to use for the visualization. Defaults to package.json in current directory."
  })
  .option("port", {
    alias: "p",
    type: "number",
    description: "The port used to serve the visualizer client."
  })
  .option("no-open", {
    type: "boolean",
    description: "Disable opening of browser on server start."
  })
  .parseSync();

/** Get the lockfile information using the CWD context or CLI options */
function getLockInfo(): { path: string; type: LockType } {
  // handle if --l was passed
  if (argv.lock) {
    const expLockType = getLockTypeFromPath(argv.lock);
    if (!expLockType) {
      throw new IndepsError(
        `"${argv.lock}" is not a valid lockfile. Please specify a yarn.lock or package-lock.json file.`
      );
    }

    if (argv.lock[0] === "/") {
      const exists = fileExist(argv.lock);

      if (!exists) {
        throw new IndepsError(`No file found at: ${argv.lock}`);
      }

      return { path: argv.lock, type: expLockType };
    }
    const relativePath = path.join(process.cwd(), argv.lock);
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
  const autoPath = path.join(process.cwd(), "./yarn.lock");

  const autoYarnExists = fileExist(autoPath);

  if (!autoYarnExists) {
    const autoPkgPath = path.join(
      process.cwd(),
      "./package-lock.json"
    );
    const autoPkgExists = fileExist(autoPkgPath);

    if (autoPkgExists) return { type: "npm", path: autoPkgPath };

    throw new IndepsError(
      "No lockfile could be found automatically in your current working directory, and there was no `--l` flag passed. Please use indeps in a project directory with a valid lockfile & package.json, or explicitly specify the files with `--l` and `--pkg`."
    );
  }

  return {
    path: autoPath,
    type: "yarn"
  };
}

/** Get the package.json information using the CWD context or CLI options */
function getPkgInfo(): { path: string } {
  if (argv.pkg) {
    if (argv.pkg[0] === "/") {
      const exists = fileExist(argv.pkg);
      if (!exists) {
        throw new IndepsError(`No file found at: ${argv.lock}`);
      }
      return { path: argv.pkg };
    }
    const relativePath = path.join(process.cwd(), "./package.json");
    const exists = fileExist(relativePath);
    if (!exists) {
      throw new IndepsError(`No file found at: ${argv.lock}`);
    }
    return {
      path: relativePath
    };
  }

  const autoPath = path.join(process.cwd(), "./package.json");
  const exists = fileExist(autoPath);
  if (!exists) {
    throw new IndepsError(`No file found at: ${argv.lock}`);
  }

  return {
    path: autoPath
  };
}

/** Start the indeps processes */
(async () => {
  // create CLI logger
  const logger = createLogger({
    level: "standard",
    customLevels: config.cli.levels
  });

  try {
    let pkgRaw: string;
    let lockRaw: string;

    // get lockfile info
    const lock = getLockInfo();

    // get package.json info
    const pkg = getPkgInfo();

    // get internal package.json info
    const indepsPkg = getIndepsPkg();

    // get package.json raw data
    try {
      pkgRaw = fs.readFileSync(pkg.path, "utf8");
    } catch (error) {
      throw new IndepsError(
        `There was an error reading your package.json file at: ${pkg.path} \n\n Does this file exist?\n\n${error}`
      );
    }

    // get lockfile raw data
    try {
      lockRaw = fs.readFileSync(lock.path, "utf8");
    } catch (error) {
      throw new IndepsError(
        `There was an error reading your lockfile file at: ${lock.path} \n\n Does this file exist?\n\n${error}`
      );
    }

    // parse package.json raw data
    logger.info("🔍 Parsing your package.json file...");
    const pkgParsed = parsePkg({ data: pkgRaw });

    // parse lockfile raw data
    logger.info("🔍 Parsing your lockfile...");
    const lockParsed = parseLock(
      { data: lockRaw, type: lock.type },
      pkgParsed
    );

    // create DAG from parsed lockfile data
    logger.info("🔍 Creating your dependency graph...");
    const lockGraph = createDependencyGraph(lockParsed);

    // normalize & hydrate parsed lockfile data w/ dependency path data && package.json data
    logger.info("🔍 Finalizing your dependency data...");
    const dependencyData = createDependencyData({
      lock: lockParsed,
      pkg: pkgParsed,
      graph: lockGraph
    });

    // create a new Viewer
    const viewer = new Viewer({
      data: dependencyData,
      port: argv.port || 8088,
      packageName: pkgParsed.name,
      indepsVersion: indepsPkg.version || "x.x.x",
      open: argv.open as boolean
    });

    // start viewer with normalized data
    await viewer.startServer();

    logger.info("Started indeps server!");
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
