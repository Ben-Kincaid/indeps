import { PackageTag, TAGS } from "src/types";
import { LockDependency } from "src/parsers";

/**
 * Config object used to compute the package tags for a given dependency.
 */
interface ComputePackageTagOpts {
  dependencies: PackageJson["dependencies"];
  devDependencies: PackageJson["devDependencies"];
  lockDependency: LockDependency;
}

/**
 * Generates the tags for a dependency.
 *
 * @remarks
 * Given a project & development dependencies object, compute the proper tags for a specific lock dependency.
 *
 * @param computePackageTagOpts - Required object for calculating a lock dependencies tags.
 * @returns
 */
export default function computePackageTags({
  dependencies = {},
  devDependencies = {},
  lockDependency
}: ComputePackageTagOpts): Array<PackageTag> {
  const tags: Array<PackageTag> = [];
  Object.keys(dependencies).forEach((depName) => {
    const depSpec = dependencies[depName] as string;
    if (
      lockDependency.name === depName &&
      lockDependency.specifications.includes(depSpec) &&
      !tags.includes(TAGS.TAG_DEPENDENCY)
    ) {
      tags.push(TAGS.TAG_DEPENDENCY);
      return;
    }
  });
  Object.keys(devDependencies).forEach((depName) => {
    const depSpec = devDependencies[depName] as string;
    if (
      lockDependency.name === depName &&
      lockDependency.specifications.includes(depSpec) &&
      !tags.includes(TAGS.TAG_DEV_DEPENDENCY)
    ) {
      tags.push(TAGS.TAG_DEV_DEPENDENCY);
    }
  });
  if (
    tags.includes(TAGS.TAG_DEV_DEPENDENCY) &&
    lockDependency.name.startsWith("@types/")
  ) {
    tags.push(TAGS.TAG_TS_DEF);
  }
  if (tags.length === 0) tags.push(TAGS.TAG_SUB_DEPENDENCY);
  return tags;
}
