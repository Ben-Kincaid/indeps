import semverLt from "semver/functions/lt";
import semverMinVersion from "semver/ranges/min-version";
import semverSubset from "semver/ranges/subset";
import semverValid from "semver/ranges/valid";

type LockProtocol =
  | "semver"
  | "tag"
  | "alias"
  | "file"
  | "link"
  | "patch"
  | "portal"
  | "workspace"
  | "exec"
  | "git";

/**
 * Get the protocol for a given package version.
 *
 * @remarks
 * Get the protocol for a given package version. Supports all protocols recognized by Yarn 1/2: https://yarnpkg.com/features/protocols
 *
 * @param input - The package version to parse.
 * @returns The protocol for the given package version.
 *
 * @internal
 */
const getLockProtocol = (input: string): LockProtocol | null => {
  if (semverValid(input)) {
    return "semver";
  }

  if (input === "latest") {
    return "tag";
  }

  if (/^npm:/.test(input)) {
    return "alias";
  }

  if (/^file:/.test(input)) {
    return "file";
  }

  if (/^link:/.test(input)) {
    return "link";
  }

  if (/^patch:/.test(input)) {
    return "patch";
  }

  if (/^portal:/.test(input)) {
    return "portal";
  }

  if (/^workspace:/.test(input)) {
    return "workspace";
  }

  if (/^exec:/.test(input)) {
    return "exec";
  }

  if (/^(github:|git@)/.test(input)) {
    return "git";
  }

  return null;
};

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
    if (getLockProtocol(a) !== "semver") {
      if (getLockProtocol(b) !== "semver") {
        return a.localeCompare(b);
      }
      return 1;
    }

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

export { getLockProtocol };

export default sortSpecifications;
