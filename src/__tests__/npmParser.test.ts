import npmParser from "src/parsers/npm";
import { getFixture } from "src/__tests__/utils";

describe("npmParser", () => {
  // Use case: is able to parse simple package with minimal project dependencies & no sub dependencies
  it("correctly parses simple package declaration", () => {
    const pkgLockData = getFixture(
      "package-lock--single.mock.json",
      false
    );

    const pkgData = getFixture<PackageJson>(
      "package--single.mock.json",
      true
    );

    const parsed = npmParser(pkgLockData, pkgData);

    expect(parsed).toEqual([
      {
        name: "path-to-regexp",
        specifications: ["^6.2.0"],
        version: "6.2.0",
        resolved:
          "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.2.0.tgz",
        integrity:
          "sha512-f66KywYG6+43afgE/8j/GoiNyygk/bnoCbps++3ErRKsIYkGGupyv07R2Ok5m9i67Iqc+T2g1eAUGUPzWhYTyg=="
      }
    ]);
  });

  // Use case: package dependency & sub dependency require same package, different spec + version
  it("correctly parses linked package declarations", () => {
    const pkgLockData = getFixture(
      "package-lock--linked.mock.json",
      false
    );

    const pkgData = getFixture<PackageJson>(
      "package--linked.mock.json",
      true
    );

    const parsed = npmParser(pkgLockData, pkgData);

    expect(parsed).toEqual([
      {
        name: "isarray",
        integrity: "sha1-ihis/Kmo9Bd+Cav8YDiTmwXR7t8=",
        resolved:
          "https://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz",
        specifications: ["0.0.1"],
        version: "0.0.1"
      },
      {
        name: "path-to-regexp",
        integrity:
          "sha512-f66KywYG6+43afgE/8j/GoiNyygk/bnoCbps++3ErRKsIYkGGupyv07R2Ok5m9i67Iqc+T2g1eAUGUPzWhYTyg==",
        resolved:
          "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.2.0.tgz",
        specifications: ["^6.2.0"],
        version: "6.2.0"
      },
      {
        name: "renux",
        integrity: "sha1-5v6omWBe8udGsQYA9CQfDBy559U=",
        resolved:
          "https://registry.npmjs.org/renux/-/renux-1.0.10.tgz",
        specifications: ["^1.0.10"],
        version: "1.0.10",
        dependencies: [{ name: "path-to-regexp", range: "^1.2.1" }]
      },
      {
        name: "path-to-regexp",
        integrity:
          "sha512-n43JRhlUKUAlibEJhPeir1ncUID16QnEjNpwzNdO3Lm4ywrBpBZ5oLD0I6br9evr1Y9JTqwRtAh7JLoOzAQdVA==",
        resolved:
          "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-1.8.0.tgz",
        specifications: ["^1.2.1"],
        version: "1.8.0",
        dependencies: [{ name: "isarray", range: "0.0.1" }]
      }
    ]);
  });

  // Use case: package dependency & sub dependency require same package, same version but different spec
  it("correctly parses shared declarations", () => {
    const pkgLockData = getFixture(
      "package-lock--shared.mock.json",
      false
    );

    const pkgData = getFixture<PackageJson>(
      "package--shared.mock.json",
      true
    );

    const parsed = npmParser(pkgLockData, pkgData);

    expect(parsed).toEqual([
      {
        name: "isarray",
        integrity: "sha1-ihis/Kmo9Bd+Cav8YDiTmwXR7t8=",
        resolved:
          "https://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz",
        specifications: ["0.0.1"],
        version: "0.0.1"
      },
      {
        name: "path-to-regexp",
        integrity: "sha1-szcFwUAjTYc8hyHHuf2LVB7Tr/k=",
        resolved:
          "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-1.2.1.tgz",
        specifications: ["1.2.1", "1.2.1 < 1.2.2"],
        version: "1.2.1",
        dependencies: [{ name: "isarray", range: "0.0.1" }]
      },
      {
        name: "renux",
        integrity: "sha1-5v6omWBe8udGsQYA9CQfDBy559U=",
        resolved:
          "https://registry.npmjs.org/renux/-/renux-1.0.10.tgz",
        specifications: ["^1.0.10"],
        version: "1.0.10",
        dependencies: [{ name: "path-to-regexp", range: "^1.2.1" }]
      },
      {
        name: "path-to-regexp",
        integrity:
          "sha512-n43JRhlUKUAlibEJhPeir1ncUID16QnEjNpwzNdO3Lm4ywrBpBZ5oLD0I6br9evr1Y9JTqwRtAh7JLoOzAQdVA==",
        resolved:
          "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-1.8.0.tgz",
        specifications: ["^1.2.1"],
        version: "1.8.0",
        dependencies: [{ name: "isarray", range: "0.0.1" }]
      },
      {
        name: "urly",
        integrity: "sha1-aCrSRMlKfXt8bOwnf+NVOgN0ql4=",
        resolved: "https://registry.npmjs.org/urly/-/urly-0.0.4.tgz",
        specifications: ["^0.0.4"],
        version: "0.0.4",
        dependencies: [{ name: "path-to-regexp", range: "1.2.1" }]
      }
    ]);
  });
  it("correctly parses duplicate nested packages", () => {
    const pkgLockData = getFixture(
      "package-lock--duplicate-nested.mock.json",
      false
    );

    const pkgData = getFixture<PackageJson>(
      "package--duplicate-nested.mock.json",
      true
    );

    const parsed = npmParser(pkgLockData, pkgData);

    expect(parsed).toEqual([
      {
        name: "json5",
        integrity: undefined,
        resolved: undefined,
        specifications: ["2.x"],
        version: "2.2.0",
        dependencies: [{ name: "minimist", range: "^1.2.5" }]
      },
      {
        name: "loader-utils",
        integrity:
          "sha512-qH0WSMBtn/oHuwjy/NucEgbx5dbxxnxup9s4PVXJUDHZBQY+s0NWA9rJf53RBnQZxfch7euUui7hpoAPvALZdA==",
        resolved:
          "https://registry.npmjs.org/loader-utils/-/loader-utils-1.4.0.tgz",
        specifications: ["1.4.0"],
        version: "1.4.0",
        dependencies: [
          { name: "big.js", range: "^5.2.2" },
          { name: "json5", range: "^1.0.0" }
        ]
      },
      {
        name: "json5",
        integrity:
          "sha512-aKS4WQjPenRxiQsC93MNfjx+nbF4PAdYzmd/1JIj8HYzqfbu86beTuNgXDzPknWk0n0uARlyewZo4s++ES36Ow==",
        resolved:
          "https://registry.npmjs.org/json5/-/json5-1.0.1.tgz",
        specifications: ["^1.0.0", "^1.0.1"],
        version: "1.0.1",
        dependencies: [{ name: "minimist", range: "^1.2.0" }]
      },
      {
        name: "ts-jest",
        integrity: undefined,
        resolved: undefined,
        specifications: ["^27.0.7"],
        version: "27.1.3",
        dependencies: [
          { name: "semver", range: "7.x" },
          { name: "json5", range: "2.x" },
          { name: "yargs-parser", range: "20.x" }
        ]
      },
      {
        name: "semver",
        integrity: undefined,
        resolved: undefined,
        specifications: ["7.x"],
        version: "7.3.5",
        dependencies: [{ name: "lru-cache", range: "^6.0.0" }]
      },
      {
        name: "tsconfig-paths",
        integrity: undefined,
        resolved: undefined,
        specifications: ["3.12.0"],
        version: "3.12.0",
        dependencies: [{ name: "json5", range: "^1.0.1" }]
      }
    ]);
  });
});
