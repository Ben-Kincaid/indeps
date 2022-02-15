import fs from "fs";
import path from "path";

import { IndepsError } from "src/error";
import { parsePkg } from "src/parsers";

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
export default function getIndepsPkg() {
  let pkgData: string;
  const pkgPath = "../package.json";
  try {
    pkgData = fs.readFileSync(path.join(__dirname, pkgPath), "utf8");
  } catch (error) {
    // handle error handling for no internal package.json
    throw new IndepsError(
      "No internal indeps package.json found. Something is wrong with how indeps is installed on your system/in your project."
    );
  }

  const pkg = parsePkg({ data: pkgData });

  return pkg;
}
