import { LockType } from "src/parsers/types";

/**
 * Parse the requested lock file type by its path.
 *
 * @remarks
 * A naive method that takes a file path and return the `LockType` by analyzing the file name & extension.
 *
 * @param path - A string representing the path to the lockfile.
 *
 * @returns A `LockType` (either "npm" or "yarn"), or null if unable to be detected.
 *
 * @internal
 */
export default function getLockTypeFromPath(
  path: string
): LockType | null {
  if (path.endsWith("yarn.lock")) return "yarn";
  if (path.endsWith("package-lock.json")) return "npm";
  return null;
}
