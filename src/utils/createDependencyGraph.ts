import { Graph } from "src/graph";
import { ParsedLock } from "src/parsers";

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
export default function createDependencyGraph(
  lock: ParsedLock
): Graph {
  const g = new Graph();

  // loop over all lock dependencies
  for (let i = 0; i < lock.length; i++) {
    const dep = lock[i];
    const depId = `${dep.name}@${dep.version}`;

    // add the current dependency as a vertex
    g.addVertex(depId);

    // if the dependency has sub-dependencies, loop over them
    if (dep.dependencies && dep.dependencies.length > 0) {
      for (let i2 = 0; i2 < dep.dependencies.length; i2++) {
        const subDep = dep.dependencies[i2];
        // loop over each lock dependency again until you find a package with that has the specific lock spec specified
        for (let d = 0; d < lock.length; d++) {
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
