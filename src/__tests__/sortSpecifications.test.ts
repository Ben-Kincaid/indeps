import sortSpecifications, {
  getLockProtocol
} from "src/parsers/utilities/sortSpecifications";

describe("sortSpecifications", () => {
  it("correctly sorts list of semver ranges", () => {
    const specs = ["1.0.0", "^2.0.0", "~3.1.1", ">=1.0.0"];

    expect(sortSpecifications(specs)).toEqual([
      "~3.1.1",
      "^2.0.0",
      ">=1.0.0",
      "1.0.0"
    ]);
  });
  it("correctly sorts ranges with same minimum version (subset ordering)", () => {
    const specs = [
      "^4.0.0 < 4.1.0",
      "4.0.0",
      "^4.0.0",
      "^4.0.0 <= 4.1.0",
      "^4.0.0 < 4.2.0",
      "^4.0.0 < 4.3.0"
    ];

    expect(sortSpecifications(specs)).toEqual([
      "^4.0.0",
      "^4.0.0 < 4.3.0",
      "^4.0.0 < 4.2.0",
      "^4.0.0 <= 4.1.0",
      "^4.0.0 < 4.1.0",
      "4.0.0"
    ]);
  });
  it("correctly sorts non-semver lock protocols", () => {
    const specs = [
      "^3.0.0",
      "^3.4.2",
      "^3.0.0 < 3.0.4",
      "patch:test-patch",
      "git@github.com:foo/bar.git",
      "portal:./foo",
      "exec:./foo-generator.js"
    ];

    expect(sortSpecifications(specs)).toEqual([
      "^3.4.2",
      "^3.0.0",
      "^3.0.0 < 3.0.4",
      "exec:./foo-generator.js",
      "git@github.com:foo/bar.git",
      "patch:test-patch",
      "portal:./foo"
    ]);
  });
});

describe("getLockProtocol", () => {
  it("correctly parses all lock protocol from string", () => {
    expect(getLockProtocol("^1.2.3")).toEqual("semver");
    expect(getLockProtocol("latest")).toEqual("tag");
    expect(getLockProtocol("npm:name@...")).toEqual("alias");
    expect(getLockProtocol("github:foo/bar")).toEqual("git");
    expect(getLockProtocol("git@github.com:foo/bar.git")).toEqual(
      "git"
    );
    expect(getLockProtocol("file:./my-package")).toEqual("file");
    expect(getLockProtocol("link:./my-folder")).toEqual("link");
    expect(
      getLockProtocol("patch:left-pad@1.0.0#./my-patch.patch")
    ).toEqual("patch");
    expect(getLockProtocol("portal:./my-folder")).toEqual("portal");
    expect(getLockProtocol("workspace:*")).toEqual("workspace");
    expect(getLockProtocol("exec:./my-generator-package")).toEqual(
      "exec"
    );
  });
});
