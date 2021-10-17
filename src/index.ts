import fs from "fs";
import yaml from "js-yaml";
import { yarnV1 as yarnV1Parser, ParsedLock, LockType } from "./parsers";

interface ParsedDeps {}

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

interface ParseDepsArgs {
  data: string;
}

interface ParsedData {
  deps: any; //fix
  lock: any; //fix
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

// parse the explicit dependencies into an object
const parseDeps = ({ data }: ParseDepsArgs) => {
  return null;
};

// process the deps and lock for usage in client
// @FIX tbd - need to figure out best way to serve this data to the separated client
const processParsedData = async ({ deps, lock }: ParsedData) => {
  console.table({ deps, lock });
};

// start indeps.
const initialize = async (depFiles: DepFiles) => {
  const { lock, deps } = depFiles;

  const { type: lockType, path: lockPath } = lock;
  const { path: depsPath } = deps;
  // parse the data for the lock file
  const lockData = fs.readFileSync(lockPath, "utf8");
  const parsedLock = parseLock({ data: lockData, type: lockType });
  // parse the data for the package.json file
  const depsData = fs.readFileSync(depsPath, "utf8");
  const parsedDeps = parseDeps({ data: depsData });

  await processParsedData({ deps: parsedDeps, lock: parsedLock });
};

export default initialize;
