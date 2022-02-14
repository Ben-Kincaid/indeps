import fs from "fs";
import path from "path";

/**
 * Get raw data from an available fixture file
 */
function getFixture<T = string>(
  fileName: string,
  parseJson = false
): T {
  const data = fs.readFileSync(
    path.resolve(__dirname, `../fixtures/${fileName}`),
    "utf8"
  );

  return parseJson ? JSON.parse(data) : data;
}

export default getFixture;
