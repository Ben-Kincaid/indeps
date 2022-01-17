import fs from "fs";
import path from "path";
import { Graph } from "src/api/graph";
import logger from "src/api/logger";
import { LockDependency, LockType, ParsedLock } from "src/api/parsers";
import npmParser from "src/api/parsers/npm";
import yarnParser from "src/api/parsers/yarn";
import {
  FullDependency,
  LockInfo,
  PackageTag,
  ParsedData,
  StartOpts,
  StartViewerOpts,
  TAGS
} from "src/api/types";
import Viewer from "src/api/viewer";

interface ParseLockOpts {
  data: string;
  type: LockType;
}

interface ParsePkgOpts {
  data: string;
}

interface CreateDependencyDataOpts {
  pkg: PackageJson;
  lock: ParsedLock;
  graph: Graph;
}

interface ComputePackageTagOpts {
  dependencies: PackageJson["dependencies"];
  devDependencies: PackageJson["devDependencies"];
  lockDependency: LockDependency;
}

/**
 * Parses a NPM/Yarn lock file.
 *
 * @remarks
 * `parseLock` will convert a lockfile (providing the path & the lock type) into a agnostic object (ParsedLock).
 *
 * @param lockInfo - an object representing the lock file
 * @returns The parsed lockfile.
 *
 * @internal
 */
function parseLock({ data, type }: ParseLockOpts): ParsedLock {
  let parsed: ParsedLock;
  if (!["npm", "yarn"].includes(type)) {
    throw new Error("Unknown lockfile type.");
  }

  // handle parsing package-lock.json
  if (type === "npm") {
    parsed = npmParser(data);
  } else if (type === "yarn") {
    parsed = yarnParser(data);
  }

  return parsed!;
}

/**
 * Parses a package.json file
 *
 * @param data - The raw package.json file data.
 * @returns a parsed package.json object
 *
 * @internal
 */
function parsePkg({ data }: ParsePkgOpts): PackageJson {
  const json = JSON.parse(data) as PackageJson;
  return json;
}

/**
 * Get the parsed package.json for the current indeps installation.
 *
 * @remarks
 * This method returns the parsed package.json file for the current indeps installation. It is used to extract metadata about the current indeps installation to display on the client(i.e. version).
 *
 * @returns A parsed package.json file
 *
 * @internal
 */
function getIndepsPkg() {
  let pkgData: string;
  let pkgPath = "../package.json";
  try {
    pkgData = fs.readFileSync(path.join(__dirname, pkgPath), "utf8");
  } catch (error) {
    // handle error handling for no internal package.json
    throw new Error(
      "No internal indeps package.json found. Something is wrong with how indeps is installed on your system/in your project."
    );
  }

  const pkg = parsePkg({ data: pkgData });

  return pkg;
}

/**
 * Create a directed acyclic dependency graph from a parsed lockfile object
 *
 * @remarks
 * This method converts a parsed lockfile (ParsedLock) into a adjacency-list representation of a directed acyclic graph.
 *
 * @param lock - The parsed lockfile
 *
 * @internal
 */
function createDependencyGraph(lock: ParsedLock): Graph {
  const g = new Graph();

  // loop over all lock dependencies
  for (var i = 0; i < lock.length; i++) {
    const dep = lock[i];
    const depId = `${dep.name}@${dep.version}`;

    // add the current dependency as a vertex
    g.addVertex(depId);

    // if the dependency has sub-dependencies, loop over them
    if (dep.dependencies && dep.dependencies.length > 0) {
      for (var i2 = 0; i2 < dep.dependencies.length; i2++) {
        const subDep = dep.dependencies[i2];
        // loop over each lock dependency again until you find a package with that has the specific lock spec specified
        for (var d = 0; d < lock.length; d++) {
          if (
            subDep.name === lock[d].name &&
            lock[d].specifications.includes(subDep.range)
          ) {
            const subId = `${lock[d].name}@${lock[d].version}`;
            // add connecting edge to dep
            g.addEdge(depId, subId);
            break;
          }
        }
      }
    }
  }
  return g;
}

/**
 * Generates the tags for a dependency.
 *
 * @remarks
 * Given a project & development dependencies object, compute the proper tags for a specific lock dependency.
 *
 * @param computePackageTagOpts - Required object for calculating a lock dependencies tags.
 * @returns
 */
function computePackageTags({
  dependencies = {},
  devDependencies = {},
  lockDependency
}: ComputePackageTagOpts): Array<PackageTag> {
  let tags: Array<PackageTag> = [];
  Object.keys(dependencies).forEach(depName => {
    const depSpec = dependencies[depName] as string;
    if (
      lockDependency.name === depName &&
      lockDependency.specifications.includes(depSpec) &&
      !tags.includes(TAGS.TAG_DEPENDENCY)
    ) {
      tags.push(TAGS.TAG_DEPENDENCY);
      return;
    }
  });
  Object.keys(devDependencies).forEach(depName => {
    const depSpec = devDependencies[depName] as string;
    if (
      lockDependency.name === depName &&
      lockDependency.specifications.includes(depSpec) &&
      !tags.includes(TAGS.TAG_DEV_DEPENDENCY)
    ) {
      tags.push(TAGS.TAG_DEV_DEPENDENCY);
    }
  });
  if (
    tags.includes(TAGS.TAG_DEV_DEPENDENCY) &&
    lockDependency.name.startsWith("@types/")
  ) {
    tags.push(TAGS.TAG_TS_DEF);
  }
  if (tags.length === 0) tags.push(TAGS.TAG_SUB_DEPENDENCY);
  return tags;
}

/**
 * Create a full dependency array for the given lockfile/package.json.
 *
 * @remarks
 * This method is meant as a 'final stop' for the parsing and transformation process of a lockfile & package.json file. It normalizes the data between the lockfile and the package.json, and adds additional metadata with help from the DAG.
 *
 * @param createDependencyDataOpts - A required object used to compose the full dependency object array.
 * @returns ParsedData
 *
 * @internal
 */
function createDependencyData({
  lock,
  pkg,
  graph
}: CreateDependencyDataOpts): ParsedData {
  const pkgDeps = pkg.dependencies;
  const pkgDevDeps = pkg.devDependencies;
  const out = lock.reduce<any>((acc, curr) => {
    const depId = `${curr.name}@${curr.version}`;

    // get the packages various require paths
    // const requirePath = graph.getParents(depId);
    const requirePath: Array<string> = [];

    // compute the packges `tags` based on their lock dependency
    const tags = computePackageTags({
      dependencies: pkgDeps,
      devDependencies: pkgDevDeps,
      lockDependency: curr
    });

    const paths = graph.getSourcePaths(depId);

    // compose the FullDependency
    const dependency: FullDependency = {
      ...curr,
      paths,
      tags
    };

    return [...acc, dependency];
  }, []);

  return out;
}

/**
 * Start the indeps client
 *
 * @remarks
 * This method will start the "viewer" for indeps - It will start a HTTP server which served the static client assets and inject the dependency data into the global window object for access on the client.
 *
 * @param startViewerOpts - The required object for configuring the indeps client
 */
async function startViewer({
  data,
  packageName,
  indepsVersion,
  port,
  open
}: StartViewerOpts) {
  const viewer = new Viewer({
    data,
    port: port,
    packageName,
    indepsVersion,
    open
  });

  await viewer.startServer();
}

/**
 * Start the indeps server.
 *
 * @remarks
 * This is the method used to start the indeps server & related processes.
 *
 * @param startOpts - The required configuration object to start the indeps server.
 * @returns A promise that resolves once stopped/aborted.
 *
 * @alpha
 */
async function initializeIndeps(startOpts: StartOpts) {
  const { open, pkg, lock, port, logLevel } = startOpts;

  // get current indeps package info
  const indepsPkg = getIndepsPkg();

  // raw pkg/lock data
  let pkgRaw: string;
  let lockRaw: string;

  // get lock/pkg properties
  const { type: lockType, path: lockPath } = lock;
  const { path: pkgPath } = pkg;

  // get pkg/lock raw data
  try {
    pkgRaw = fs.readFileSync(pkgPath, "utf8");
  } catch (error) {
    throw new Error(
      `There was an error reading your package.json file at: ${pkgPath} \n\n Does this file exist?\n\n${error}`
    );
  }
  try {
    lockRaw = fs.readFileSync(lockPath, "utf8");
  } catch (error) {
    throw new Error(
      `There was an error reading your lockfile file at: ${lockPath} \n\n Does this file exist?\n\n${error}`
    );
  }

  // get parsed lock data
  logger.log({
    level: "info",
    msg: `🔍 Parsing your lockfile...`
  });
  const lockParsed = parseLock({ data: lockRaw, type: lockType });

  // get parsed pkg data
  logger.log({
    level: "info",
    msg: `🔍 Parsing your package.json file...`
  });
  const pkgParsed = parsePkg({ data: pkgRaw });

  // // create DAG
  logger.log({
    level: "info",
    msg: `🔍 Creating your dependency graph...`
  });
  const lockGraph = createDependencyGraph(lockParsed);

  // // normalize parsed lock data w/ dependency path data && pkg data
  logger.log({
    level: "info",
    msg: `🔍 Finalizing your dependency data...`
  });

  const dependencyData = createDependencyData({
    lock: lockParsed,
    pkg: pkgParsed,
    graph: lockGraph
  });

  // // start viewer with normalized data
  await startViewer({
    data: dependencyData,
    packageName: pkgParsed.name,
    indepsVersion: indepsPkg.version || "x.x.x",
    port: port || 3988,
    open
  });
}

export { initializeIndeps, ParsedData, FullDependency };
