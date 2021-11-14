import fs from "fs";
import logger from "./logger";
import {
  yarnV1 as parseYarnV1,
  yarnNext as parseYarnNext,
  LockType,
  ParsedLock
} from "./parsers";
import Viewer from "./viewer";

interface LockInfo {
  type: LockType;
  path: string;
}

interface StartOpts {
  lock: LockInfo;
  port?: number;
}

interface ParseLockArgs {
  data: string;
  type: LockType;
}

interface StartViewerOpts {
  data: ParsedLock;
  port: number;
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
const startViewer = async ({ data, port }: StartViewerOpts) => {
  const viewer = new Viewer({ lockData: data, port: port });

  await viewer.startServer();
};

// start indeps.
const start = async (startOpts: StartOpts) => {
  const { port } = startOpts;
  const { lock } = startOpts;
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
  await startViewer({ data: parsedLock, port: port || 8008 });
};

export default start;
