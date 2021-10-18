import fs from "fs";
import { yarnV1 as yarnV1Parser, LockType, ParsedLock } from "./parsers";

interface DepFiles {
  lock: {
    type: LockType;
    path: string;
  };
  deps: {
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

// parse the lock file into an object
const parseLock = ({ data, type }: ParseLockArgs): any => {
  let parsed;

  if (type === "yarn") {
    parsed = yarnV1Parser(data);
  } else {
    throw new Error("NPM is not supported in this version of indeps.");
  }

  return parsed;
};

// process the parsed lockfile for usage in client
// @FIX tbd - need to figure out best way to serve this data to the separated client
const processParsedData = async ({ lock }: ParsedData) => {
  // do something with the parsed lock data
};

// start indeps.
const start = async (depFiles: DepFiles) => {
  const { lock } = depFiles;
  const { type: lockType, path: lockPath } = lock;

  // parse the data for the lock file
  const lockData = fs.readFileSync(lockPath, "utf8");
  const parsedLock = parseLock({ data: lockData, type: lockType });

  // handle the parsed lock file data
  await processParsedData({ lock: parsedLock });
};

export default start;
