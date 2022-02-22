import semverLt from "semver/functions/lt";
import semverMinVersion from "semver/ranges/min-version";
import semverSubset from "semver/ranges/subset";
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
    // get minimum possible versions for ranges
    const aMin = semverMinVersion(a);
    const bMin = semverMinVersion(b);

    // if there is no valid range returned for either, return 0
    if (!aMin || !bMin) return 0;

    // if both min versions are the same, place subsets ahead
    if (aMin.raw === bMin.raw) {
      if (semverSubset(a, b)) {
        return 1;
      } else {
        return -1;
      }
    } else if (semverLt(aMin.raw, bMin.raw)) {
      // otherwise, push a ahead if less than b min version
      return 1;
    }

    return -1;
  });
}

export default sortSpecifications;
