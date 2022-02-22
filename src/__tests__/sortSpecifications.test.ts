import sortSpecifications from "src/parsers/utilities/sortSpecifications";

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
});
