import { Graph } from "src/api/graph";

const nodes = ["node-1", "node-2", "node-3", "node-4", "node-5"];
const edges = [
  ["node-1", "node-2"],
  ["node-2", "node-3"],
  ["node-2", "node-4"],
  ["node-2", "node-5"],
  ["node-3", "node-5"]
];

describe("Graph", () => {
  it("adds node to the graph", () => {
    const g = new Graph();
    const node = "the-node";

    g.addVertex(node);

    expect(g.nodes.has(node)).toEqual(true);
  });

  it("adds edge to the graph", () => {
    const g = new Graph();
    const node1 = "the-node-1";
    const node2 = "the-node-2";

    g.addVertex(node1);
    g.addVertex(node2);

    g.addEdge(node1, node2);

    expect(g.nodes.size).toEqual(2);
    expect(g.nodes.get(node1)).toEqual([node2]);
    expect(g.nodes.get(node2)).toEqual([]);
  });

  it("reverses the graph", () => {
    const g = new Graph();

    nodes.forEach(node => {
      g.addVertex(node);
    });

    edges.forEach(([source, dest]) => {
      g.addEdge(source, dest);
    });

    expect(Object.fromEntries(g.reverse())).toEqual({
      "node-1": [],
      "node-2": ["node-1"],
      "node-3": ["node-2"],
      "node-4": ["node-2"],
      "node-5": ["node-2", "node-3"]
    });
  });

  it("gets paths to all root nodes from a specified starting node", () => {
    const g = new Graph();

    nodes.forEach(node => {
      g.addVertex(node);
    });

    edges.forEach(([source, dest]) => {
      g.addEdge(source, dest);
    });

    const paths = g.getSourcePaths("node-5");

    expect(paths).toEqual([["node-5", "node-2", "node-1"]]);
  });
});
