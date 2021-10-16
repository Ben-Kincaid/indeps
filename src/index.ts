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

  console.log("Starting doc output: " + doc);
};

const parseDeps = ({ data }: ParseDepsArgs) => {};

const processParsedData = ({ deps, lock }: ParsedData) => {};

const initialize = async (depFiles: DepFiles) => {
  const { lock, deps } = depFiles;

  const { type: lockType, path: lockPath } = lock;
  const { path: depsPath } = deps;

  const lockData = fs.readFileSync(lockPath, "utf8");
  const parsedLock = parseLock({ data: lockData, type: lockType });

  const depsData = fs.readFileSync(depsPath, "utf8");
  const parsedDeps = parseDeps({ data: depsData });

  await processParsedData({ deps: parsedDeps, lock: parsedLock });
};

initialize({
  lock: {
    type: "yarn",
    path: "/Users/benkincaid/Projects/npm-depviz/yarn.lock"
  },
  deps: {
    path: "/Users/benkincaid/Projects/npm-depviz/package.json"
  }
});
