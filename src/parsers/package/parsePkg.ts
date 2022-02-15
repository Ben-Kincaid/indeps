/**
 * Config required for parsing the package.json file
 */
interface ParsePkgOpts {
  data: string;
}

/**
 * Parses a package.json file
 *
 * @param data - The raw package.json file data.
 * @returns a parsed package.json object
 *
 * @internal
 */
export default function parsePkg({
  data
}: ParsePkgOpts): PackageJson {
  const json = JSON.parse(data) as PackageJson;
  return json;
}
