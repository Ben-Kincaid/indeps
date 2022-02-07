import { computePackageTags } from "src/api";
import { LockDependency } from "src/api/parsers";
import { getFixture } from "src/api/__tests__/utils";

describe("computePackageTags", () => {
  it("creates proper package tags for project dependency", () => {
    const dependency: any = {
      name: "path-to-regexp",
      version: "6.2.0",
      resolved:
        "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.2.0.tgz",
      integrity:
        "sha512-f66KywYG6+43afgE/8j/GoiNyygk/bnoCbps++3ErRKsIYkGGupyv07R2Ok5m9i67Iqc+T2g1eAUGUPzWhYTyg==",
      specifications: ["^6.2.0"]
    };

    const parsedPkg = getFixture<PackageJson>(
      "package--single.mock.json",
      true
    );

    const tags = computePackageTags({
      dependencies: parsedPkg.dependencies,
      devDependencies: parsedPkg.devDependencies,
      lockDependency: dependency
    });

    expect(tags).toEqual(["TAG_DEPENDENCY"]);
  });

  it("creates proper package tags for development dependency", () => {
    const dependency: any = {
      name: "path-to-regexp",
      version: "6.2.0",
      resolved:
        "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.2.0.tgz",
      integrity:
        "sha512-f66KywYG6+43afgE/8j/GoiNyygk/bnoCbps++3ErRKsIYkGGupyv07R2Ok5m9i67Iqc+T2g1eAUGUPzWhYTyg==",
      specifications: ["^6.2.0"]
    };

    const parsedPkg = getFixture<PackageJson>(
      "package--single-dev.mock.json",
      true
    );

    const tags = computePackageTags({
      dependencies: parsedPkg.dependencies,
      devDependencies: parsedPkg.devDependencies,
      lockDependency: dependency
    });

    expect(tags).toEqual(["TAG_DEV_DEPENDENCY"]);
  });

  it("creates proper package tags for project + dev dependency (similiar spec)", () => {
    const dependency: LockDependency = {
      name: "path-to-regexp",
      version: "6.2.0",
      resolved:
        "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.2.0.tgz",
      integrity:
        "sha512-f66KywYG6+43afgE/8j/GoiNyygk/bnoCbps++3ErRKsIYkGGupyv07R2Ok5m9i67Iqc+T2g1eAUGUPzWhYTyg==",
      specifications: ["^6.2.0"]
    };

    const parsedPkg = getFixture<PackageJson>(
      "package--dev-and-proj-similar.mock.json",
      true
    );

    const tags = computePackageTags({
      dependencies: parsedPkg.dependencies,
      devDependencies: parsedPkg.devDependencies,
      lockDependency: dependency
    });

    console.log(parsedPkg.devDependencies);

    expect(tags).toEqual(["TAG_DEV_DEPENDENCY", "TAG_DEPENDENCY"]);
  });

  it("creates proper package tags for project + dev dependency (different spec, same resolution)", () => {
    const dependency = {
      name: "path-to-regexp",
      version: "6.2.0",
      resolved:
        "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.2.0.tgz",
      integrity:
        "sha512-f66KywYG6+43afgE/8j/GoiNyygk/bnoCbps++3ErRKsIYkGGupyv07R2Ok5m9i67Iqc+T2g1eAUGUPzWhYTyg==",
      specifications: ["^6.2.0", "^6.2.0"]
    };

    const parsedPkg = getFixture<PackageJson>(
      "package--dev-and-proj-different.mock.json",
      true
    );

    const tags = computePackageTags({
      dependencies: parsedPkg.dependencies,
      devDependencies: parsedPkg.devDependencies,
      lockDependency: dependency
    });

    expect(tags).toEqual(["TAG_DEV_DEPENDENCY", "TAG_DEPENDENCY"]);
  });
});

// import { createDependencyData, createDependencyGraph } from "src/api";
// import loggerInstance from "src/api/logger";
// import { ParsedLock } from "src/api/parsers";
// import npmParser from "src/api/parsers/npm";
// import yarnParser from "src/api/parsers/yarn";
// import { getFixture } from "src/api/__tests__/utils";

// function createParsedLock(
//   fixtureName: string,
//   type: "npm" | "yarn" = "npm",
//   pkg: PackageJson | undefined
// ) {
//   const data = getFixture(fixtureName, false);
//   if (type === "npm") {
//     return npmParser(data, pkg!);
//   } else {
//     return yarnParser(data);
//   }
// }

// describe("createDependencyData", () => {
//   it("creates an array of proper full dependency objects, simple", () => {
//     const parsedPkg = getFixture<PackageJson>(
//       "package--single.mock.json",
//       true
//     );

//     const parsedLock = createParsedLock(
//       "package-lock--single.mock.json",
//       "npm",
//       parsedPkg
//     );

//     const parsedGraph = createDependencyGraph(parsedLock);

//     const parsed = createDependencyData({
//       lock: parsedLock,
//       pkg: parsedPkg,
//       graph: parsedGraph
//     });

//     expect(parsed).toEqual([
//       {
//         name: "path-to-regexp",
//         version: "6.2.0",
//         resolved:
//           "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.2.0.tgz",
//         integrity:
//           "sha512-f66KywYG6+43afgE/8j/GoiNyygk/bnoCbps++3ErRKsIYkGGupyv07R2Ok5m9i67Iqc+T2g1eAUGUPzWhYTyg==",
//         specifications: ["^6.2.0"],
//         tags: ["TAG_DEPENDENCY"],
//         paths: [["path-to-regexp@6.2.0"]]
//       }
//     ]);
//   });
//   it("creates an array of proper full dependency objects, linked", () => {
//     const parsedPkg = getFixture<PackageJson>(
//       "package--linked.mock.json",
//       true
//     );

//     const parsedLock = createParsedLock(
//       "package-lock--linked.mock.json",
//       "npm",
//       parsedPkg
//     );

//     const parsedGraph = createDependencyGraph(parsedLock);

//     const parsed = createDependencyData({
//       lock: parsedLock,
//       pkg: parsedPkg,
//       graph: parsedGraph
//     });

//     expect(parsed).toEqual([
//       {
//         name: "path-to-regexp",
//         version: "6.2.0",
//         resolved:
//           "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.2.0.tgz",
//         integrity:
//           "sha512-f66KywYG6+43afgE/8j/GoiNyygk/bnoCbps++3ErRKsIYkGGupyv07R2Ok5m9i67Iqc+T2g1eAUGUPzWhYTyg==",
//         specifications: ["^6.2.0"],
//         tags: ["TAG_DEPENDENCY"],
//         paths: [["path-to-regexp@6.2.0"]]
//       }
//     ]);
//   });
// });
