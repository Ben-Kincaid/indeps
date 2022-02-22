import semverLt from "semver/functions/lt";
import semverMinVersion from "semver/ranges/min-version";

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
    const aMin = semverMinVersion(a);
    const bMin = semverMinVersion(b);

    if (!aMin || !bMin || aMin.raw === bMin.raw) {
      return 0;
    } else if (semverLt(aMin.raw, bMin.raw)) {
      return 1;
    }
    return -1;
  });
}

export default sortSpecifications;
