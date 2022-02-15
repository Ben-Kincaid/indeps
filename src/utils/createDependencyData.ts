import { FullDependency, ParsedData } from "src/types";
import { Graph } from "src/graph";
import { ParsedLock } from "src/parsers";
import computePackageTags from "src/utils/computePackageTags";

/**
 * Config for normalizing & hydrating final dependency objects.
 */
interface CreateDependencyDataOpts {
  /** The parsed package.json file */
  pkg: PackageJson;
  /** The parsed lockfile */
  lock: ParsedLock;
  /** The `Graph` representing the dependency tree of our parsed lockfile */
  graph: Graph;
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
export default function createDependencyData({
  lock,
  pkg,
  graph
}: CreateDependencyDataOpts): ParsedData {
  const pkgDeps = pkg.dependencies;
  const pkgDevDeps = pkg.devDependencies;
  const out = lock.reduce<ParsedData>((acc, curr) => {
    const depId = `${curr.name}@${curr.version}`;

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
