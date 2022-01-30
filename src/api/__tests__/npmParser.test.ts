import fs from "fs";
import path from "path";
import npmParser from "src/api/parsers/npm";

describe("npmParser", () => {
  it("correctly parses simple package declaration", () => {
    const pkgLockData = fs.readFileSync(
      path.resolve(__dirname, "./fixtures/package-lock--single.mock.json"),
      "utf8"
    );

    const pkgData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "./fixtures/package--single.mock.json"),
        "utf8"
      )
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

  it("correctly parses linked package declarations", () => {
    const pkgLockData = fs.readFileSync(
      path.resolve(__dirname, "./fixtures/package-lock--linked.mock.json"),
      "utf8"
    );

    const pkgData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "./fixtures/package--linked.mock.json"),
        "utf8"
      )
    );

    const parsed = npmParser(pkgLockData, pkgData);

    expect(parsed).toEqual([
      {
        name: "isarray",
        integrity: "sha1-ihis/Kmo9Bd+Cav8YDiTmwXR7t8=",
        resolved: "https://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz",
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
        resolved: "https://registry.npmjs.org/renux/-/renux-1.0.10.tgz",
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
  it("correctly parses shared declarations", () => {
    const pkgLockData = fs.readFileSync(
      path.resolve(__dirname, "./fixtures/package-lock--shared.mock.json"),
      "utf8"
    );

    const pkgData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "./fixtures/package--shared.mock.json"),
        "utf8"
      )
    );

    const parsed = npmParser(pkgLockData, pkgData);

    expect(parsed).toEqual([
      {
        name: "isarray",
        integrity: "sha1-ihis/Kmo9Bd+Cav8YDiTmwXR7t8=",
        resolved: "https://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz",
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
        resolved: "https://registry.npmjs.org/renux/-/renux-1.0.10.tgz",
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
});
