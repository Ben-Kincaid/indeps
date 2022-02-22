import rangeSubset from "semver/ranges/subset";

/**
 * Sort an array of package semver specifications
 *
 * @param specifications - An array of semver specifications for a given package declaration
 * @returns A sorted array of packagage specficications, with most current specification at the front of the stack
 *
 * @internal
 */
function sortSpecifications(
  specifications: Array<string>
): Array<string> {
  return specifications.sort((a, b) => {
    if (a === b) {
      return 0;
    } else if (rangeSubset(a, b)) {
      return -1;
    }
    return 1;
  });
}

export default sortSpecifications;
