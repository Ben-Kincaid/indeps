import fs from "fs";

/**
 * Simple method for checking the existence of a file.
 *
 * @param filePath - A string representation of the absolute path to a file.
 *
 * @returns True if file exists, false if not.
 */
export default function fileExist(filePath: string): boolean {
  return fs.existsSync(filePath);
}
