import { computePackageTags } from "src/api";
import { LockDependency } from "src/api/parsers";
import { getFixture } from "src/api/__tests__/utils";

describe("computePackageTags", () => {
  it("creates proper package tags for project dependency", () => {
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

  it("creates proper package tags for nested dependency", () => {
    const dependency: LockDependency = {
      name: "isarray",
      version: "0.0.1",
      resolved: "https://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz",
      integrity: "sha1-ihis/Kmo9Bd+Cav8YDiTmwXR7t8=",
      specifications: ["0.0.1"]
    };

    const parsedPkg = getFixture<PackageJson>(
      "package--shared.mock.json",
      true
    );

    const tags = computePackageTags({
      dependencies: parsedPkg.dependencies,
      devDependencies: parsedPkg.devDependencies,
      lockDependency: dependency
    });

    expect(new Set(tags)).toEqual(new Set(["TAG_SUB_DEPENDENCY"]));
  });
});
