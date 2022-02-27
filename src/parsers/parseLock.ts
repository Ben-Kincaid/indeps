import { IndepsError } from "src/error";
import { LockType, ParsedLock } from "src/parsers";
import npmParser from "src/parsers/npm";
import yarnParser from "src/parsers/yarn";

interface ParseLockOpts {
  data: string;
  type: LockType;
}

/**
 * Parses a NPM/Yarn lock file.
 *
 * @remarks
 * `parseLock` will convert a lockfile (providing the path & the lock type) into a agnostic object (ParsedLock).
 *
 * @param lockInfo - an object representing the lock file
 * @param pkg - The parsed package.json file.
 * @returns The parsed lockfile.
 *
 * @internal
 */
export default function parseLock(
  { data, type }: ParseLockOpts,
  pkg: PackageJson
): ParsedLock {
  let parsed: ParsedLock;
  if (!["npm", "yarn"].includes(type)) {
    throw new IndepsError("Unknown lockfile type.");
  }

  // handle parsing package-lock.json
  if (type === "npm") {
    parsed = npmParser(data, pkg);
  } else if (type === "yarn") {
    parsed = yarnParser(data, pkg);
  } else {
    throw new IndepsError("Invalid lockfile type.");
  }

  return parsed;
}
