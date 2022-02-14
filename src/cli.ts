import path from "path";
import fs from "fs";

import { config } from "winston";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { IndepsError } from "src/error";

import { createLogger } from "./logger";
import { LockType } from "./api/parsers";
import { initializeIndeps } from "./api";

const argv = yargs(hideBin(process.argv))
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

const fileExist = (filePath: string): boolean => fs.existsSync(filePath);

const getLockTypeFromPath = (path: string): LockType | null => {
  if (path.endsWith("yarn.lock")) return "yarn";
  if (path.endsWith("package-lock.json")) return "npm";
  return null;
};

const getLockInfo = (): { path: string; type: LockType } => {
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
    const autoPkgPath = path.join(process.cwd(), "./package-lock.json");
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
};

const getPkgInfo = (): { path: string } => {
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
};

(async () => {
  const logger = createLogger({
    level: "standard",
    customLevels: config.cli.levels
  });

  // start indeps
  try {
    // get lockfile info
    const lock = getLockInfo();

    // get package.json info
    const pkg = getPkgInfo();

    await initializeIndeps({
      lock: lock,
      pkg: pkg,
      port: argv.port,
      open: argv.open as boolean,
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
