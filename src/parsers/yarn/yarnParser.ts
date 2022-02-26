import { ParsedLock, yarnV1 } from "src/parsers";
import { IndepsError } from "src/error";

/**
 * Get the version of a yarn.lock file.
 *
 * @remarks
 * This method returns the version of a yarn.lock file. If no version was able to be detected, it will return `0`.
 *
 * @param data The raw yarn.lock file data
 * @returns The yarn.lock version, or 0 if unable to be detected.
 */
function getYarnVersionFromString(data: string): number {
  let version = 0;
  const lines = data.split("\n");
  if (lines.length >= 2) {
    const commentLine = lines[1];
    if (commentLine === "# yarn lockfile v1") {
      version = 1;
    } else if (
      commentLine ===
      "# Manual changes might be lost - proceed with caution!"
    ) {
      version = 2;
    }
  }
  return version;
}

/**
 * Convert raw yarn.lock data into parsed object.
 *
 * @remarks
 * This method takes a string representation of a `yarn.lock` file and converts it into a parsed object. Supports Yarn V1 & Yarn V2(berry) lockfiles.
 *
 * @param data - The raw string data for the `yarn.lock` file
 * @returns A fully parsed lockfile
 */
function yarnParser(data: string): ParsedLock {
  let out: ParsedLock;

  const version = getYarnVersionFromString(data);
  if (version === 0) {
    throw new IndepsError(
      "Indeps was not able to detect the version of your Yarn lockfile. "
    );
  } else if (version === 1) {
    out = yarnV1(data);
  } else if (version === 2) {
    throw new IndepsError(
      "Indeps does not currently support Yarn 2 lockfiles."
    );
  } else {
    throw new IndepsError(
      "Indeps does not support this version of Yarn's lockfile."
    );
  }

  return out;
}

export default yarnParser;
