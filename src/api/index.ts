import fs from "fs";
import logger from "./logger";
import {
  yarnV1 as parseYarnV1,
  yarnNext as parseYarnNext,
  LockType,
  ParsedLock
} from "./parsers";
import Viewer from "./viewer";

interface DepFiles {
  lock: {
    type: LockType;
    path: string;
  };
}

interface ParseLockArgs {
  data: string;
  type: LockType;
}

interface ParsedData {
  lock: ParsedLock; //fix
}

function getYarnVersion(data: string): number {
  const lines = data.split("\n");
  if (!lines || lines.length < 2) {
    throw new Error(
      "Invalid yarn file: yarn.lock version unable to be detected."
    );
  }

  return lines[1] === "# yarn lockfile v1" ? 1 : 2;
}

// parse the lock file into an object
const parseLock = ({ data, type }: ParseLockArgs): any => {
  let parsed;

  if (type === "yarn") {
    const version = getYarnVersion(data);
    if (version === 1) {
      parsed = parseYarnV1(data);
    }
    if (version === 2) {
      parsed = parseYarnNext(data);
    }
  } else {
    throw new Error(
      "Sorry - we do not yet support npm's package-lock.json files."
    );
  }

  return parsed;
};

// process the parsed lockfile for usage in client
const startViewer = async ({ lock }: ParsedData) => {
  const viewer = new Viewer({ lockData: lock, port: 8123 });

  await viewer.startServer();
};

// start indeps.
const start = async (depFiles: DepFiles) => {
  const { lock } = depFiles;
  const { type: lockType, path: lockPath } = lock;

  let lockData: string;

  // parse the data for the lock file
  try {
    logger.log({
      level: "info",
      msg: "🔍 Beginning dependency analyzation..."
    });
    lockData = fs.readFileSync(lockPath, "utf8");
  } catch (error) {
    throw new Error(
      `There was an error parsing your lock file at: ${lockPath} \n${error}`
    );
  }

  const parsedLock = parseLock({ data: lockData, type: lockType });

  logger.log({
    level: "info",
    msg: "🔍 Succesfully parsed dependencies..."
  });

  debugger;

  // handle the parsed lock file data
  await startViewer({ lock: parsedLock });
};

export default start;
