import fs from "fs";
import logger from "./logger";
import {
  yarnV1 as parseYarnV1,
  yarnNext as parseYarnNext,
  LockType,
  ParsedLock,
  LockDependency
} from "./parsers";
import Viewer from "./viewer";
import indepsPkg from "package.json";

const TAG_DEPENDENCY = "TAG_DEPENDENCY";
const TAG_DEV_DEPENDENCY = "TAG_DEV_DEPENDENCY";

type PackageTag = typeof TAG_DEPENDENCY | typeof TAG_DEV_DEPENDENCY;

interface FullLockDependency extends LockDependency {
  tags: Array<PackageTag>;
}

export type ParsedData = Array<FullLockDependency>;

interface ParsedDataArgs {
  pkg?: PackageJson;
  lock: ParsedLock;
}

interface ParsePkgArgs {
  data: string;
}

interface PkgInfo {
  path: string;
}

interface LockInfo {
  type: LockType;
  path: string;
}

interface StartOpts {
  lock: LockInfo;
  pkg?: PkgInfo;
  port?: number;
  open?: boolean;
}

interface ParseLockArgs {
  data: string;
  type: LockType;
}

interface StartViewerOpts {
  data: ParsedData;
  indepsVersion: string;
  port: number;
  packageName?: string;
  open?: boolean;
}

interface CreatePackageTagData {
  deps: Array<string>;
  devDeps: Array<string>;
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

const computePackageTags = (
  name: string,
  { deps, devDeps }: CreatePackageTagData
): Array<PackageTag> => {
  let tags: Array<PackageTag> = [];

  for (var i = 0; i < deps.length; i++) {
    const dep = deps[i];
    if (dep === name) {
      tags.push(TAG_DEPENDENCY);
    }
  }

  for (var i = 0; i < devDeps.length; i++) {
    const devDep = devDeps[i];
    if (devDep === name) {
      tags.push(TAG_DEV_DEPENDENCY);
    }
  }

  return tags;
};

const parseData = ({ pkg, lock }: ParsedDataArgs) => {
  let pkgDeps: Array<string>;
  let pkgDevDeps: Array<string>;
  let parsedData: ParsedData;

  if (pkg) {
    pkgDeps = Object.keys(pkg.dependencies || {});
    pkgDevDeps = Object.keys(pkg.devDependencies || {});
  }

  parsedData = lock.map(lockItem => {
    const pkgTags = computePackageTags(lockItem.name, {
      deps: pkgDeps || [],
      devDeps: pkgDevDeps || []
    });

    return {
      ...lockItem,
      tags: pkgTags
    };
  });

  return parsedData;
};

const parsePkg = ({ data }: ParsePkgArgs): PackageJson => {
  const parsed: PackageJson = JSON.parse(data);
  return parsed;
};

// parse the lock file into an object
const parseLock = ({ data, type }: ParseLockArgs): ParsedLock => {
  let parsed: ParsedLock = [];

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
const startViewer = async ({
  data,
  packageName,
  indepsVersion,
  port,
  open
}: StartViewerOpts) => {
  const viewer = new Viewer({
    data,
    port: port,
    packageName,
    indepsVersion,
    open
  });

  await viewer.startServer();
};

// start indeps.
const initializeIndeps = async (startOpts: StartOpts) => {
  const { lock, pkg, port, open } = startOpts;
  const { type: lockType, path: lockPath } = lock;

  let lockData: string;
  let pkgData: string;

  let parsedPkg: PackageJson | undefined;

  // parse the data for the lock file
  try {
    logger.log({
      level: "info",
      msg: "🔍 Starting dependency analysis..."
    });
    lockData = fs.readFileSync(lockPath, "utf8");
  } catch (error) {
    throw new Error(
      `There was an error parsing your lock file at: ${lockPath} \n${error}`
    );
  }

  // get contents of pkg file
  if (pkg) {
    const { path: pkgPath } = pkg;
    try {
      logger.log({
        level: "info",
        msg: "🔍 Starting package.json analysis..."
      });
      pkgData = fs.readFileSync(pkgPath, "utf8");
    } catch (error) {
      throw new Error(
        `There was an error parsing your package.json file at: ${pkgPath} \n${error}`
      );
    }

    parsedPkg = parsePkg({ data: pkgData });
  }

  const parsedLock = parseLock({ data: lockData, type: lockType });

  const parsedData = parseData({ lock: parsedLock, pkg: parsedPkg });

  logger.log({
    level: "info",
    msg: "🔍 Succesfully parsed dependencies..."
  });

  // get current version specified in internal package.json
  const indepsVersion = indepsPkg.version;

  await startViewer({
    data: parsedData,
    packageName: parsedPkg ? parsedPkg.name : "",
    indepsVersion,
    port: port || 8008,
    open
  });
};

export { initializeIndeps };
