import { offsetComparator } from "react-virtuoso/dist/sizeSystem";

type EdgeDirection = "directed" | "undirected";

class Graph {
  nodes: Map<string, Array<string>>;
  edgeDirection: EdgeDirection;
  constructor(edgeDirection: EdgeDirection = "directed") {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  /**
   * Add a vertex to the graph
   *
   * @remarks
   * Adds a vertex to the graph implementation.
   *
   * @param val - The string value to add as a node in the graph
   *
   * @returns The set value
   *
   */
  addVertex(val: string): string {
    this.nodes.set(val, []);
    return val;
  }

  /**
   * Add an edge to the graph
   *
   * @remarks
   * Adds a connecting edge between two nodes within the graph.
   *
   * @param source - the source node
   * @param destination  - the destination node
   */
  addEdge(source: string, destination: string) {
    if (this.nodes.has(source)) {
      this.nodes.get(source)!.push(destination);
    } else {
      throw new Error(
        `Unable to add "${destination}" to unknown source node: "${source}"`
      );
    }
  }

  /**
   * Reverse the current graph
   *
   * @remarks
   * Return a returned version of the current graph. Used internally for easily searching through parents of a node.
   */
  reverse(): Map<string, Array<string>> {
    const reversed = new Map<string, Array<string>>();

    for (const [node, children] of this.nodes) {
      if (!reversed.has(node)) reversed.set(node, []);
      children.forEach(child => {
        if (!reversed.has(child)) {
          reversed.set(child, []);
        }

        const curr = reversed.get(child)!;

        curr.push(node);
      });
    }

    return reversed;
  }

  /**
   * Get the paths from a specific node to its connected source nodes.
   *
   * @remarks
   * This method will take a specific node and return an array of paths to unique root nodes. Can be used to find the dependency path(s).
   *
   * @param start - The initial node used in DFS.
   * @returns
   */
  getSourcePaths(start: string) {
    return this.dfsPaths([start], []);
  }

  /**
   * Use a depth-first search to find all paths to unique source nodes.
   *
   * @remarks
   * This method is a recursive depth-first-search that keeps track of its travel path for each respective root node.
   *
   * @param path - The current path before it has yet reached a root node
   * @param paths - The cumulative paths for the given starting node
   * @param visited - An array for keeping track of already-visited nodes
   * @returns An array of array of strings representing the multiple routes to route nodes.
   */

  dfsPaths(
    path: Array<string>,
    paths: Array<Array<string>> = [],
    visited: Array<string> = []
  ) {
    // get last item set in path
    const node = path[path.length - 1];
    const nodes = this.reverse();

    // check if reversed AL has the node
    if (nodes.has(node) && !visited.includes(node)) {
      visited.push(node);
      const descendants = nodes.get(node);
      // if the node has descendants(ancestors after reverse),
      if (descendants && descendants.length > 0) {
        descendants?.forEach(descendant => {
          const newPath = [...path, descendant];
          paths = this.dfsPaths(newPath, paths, visited);
        });
      } else {
        paths.push(path);
      }
    }
    return paths;
  }
}

export { Graph, EdgeDirection };
