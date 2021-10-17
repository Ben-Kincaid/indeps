import fs from "fs";
import yaml from "js-yaml";
import yarnParser from "./parsers";

type LockType = "npm" | "yarn";

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

const parseLock = ({ data, type }: ParseLockArgs) => {
  const doc = yarnParser(data);
  return doc;
};

const parseDeps = ({ data }: ParseDepsArgs) => {
  return null;
};

const processParsedData = async ({ deps, lock }: ParsedData) => {
  console.table({ deps, lock });
};

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
