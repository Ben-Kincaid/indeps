import { LockDependency, ParsedLock } from "src/api/parsers";

/**
 * Create a lock dependency from a dependency object from package-lock.json.
 *
 * @remarks
 * This method will take a dependency object from `package.dependencies[]` and normalize it into a universal lock dependency object (LockDependency).
 *
 * @param name - The name of the package
 * @param dependency - The object with metadata for the package
 * @param dependencies - All of the lockfiles listed dependencies
 * @returns A full lock dependency object.
 *
 * @internal
 */
function createLockDependency(
  name: string,
  dependency: PackageLockDependencyBase,
  dependencies: PackageLock["dependencies"]
): LockDependency {
  // get the specifications for this package
  const specifications = Object.keys(dependencies).reduce<Array<string>>(
    (acc, depKey) => {
      const dependency = dependencies[depKey];

      // if there is no `requires` property, return
      if (!dependency.requires) return acc;

      // if the requires object includes this dependencies name,
      // push its range as a specification
      if (
        Object.keys(dependency.requires).includes(name) &&
        !acc.includes(dependency.requires[name]!)
      ) {
        acc.push(dependency.requires[name]!);
      }

      // loop through inner dependencies for specifications
      if (dependency.dependencies) {
        // for each inner dependency,
        // check if it also requires the current package
        // and push its range if so.
        Object.keys(dependency.dependencies).forEach(innerDepKey => {
          const innerDep = dependency.dependencies[innerDepKey];
          if (!innerDep.requires) return;
          if (Object.keys(innerDep.requires).includes(name)) {
            acc.push(innerDep.requires[name]!);
          }
        });
      }

      // return the accumulator with the newly-pushed dependency/inner dependency specifications
      return acc;
    },
    []
  );

  // return all LockDependency properties
  return {
    name,
    version: dependency.version,
    specifications,
    resolved: dependency.resolved,
    integrity: dependency.integrity,
    ...(dependency.requires && {
      dependencies: Object.keys(dependency.requires).map(depKey => ({
        name: depKey,
        range: dependency.requires![depKey]!
      }))
    })
  };
}

/**
 * Normalizes direct package-lock.json parsed JSON into `ParsedLock`.
 *
 * @remarks
 * This method takes a fully parsed package-lock.json file and converts it into a full `ParsedLock`.
 *
 * @param parsed - the unaltered, parsed package-lock.json file.
 * @returns A fully parsed lock file
 *
 * @internal
 */
function normalizeParsedNPM(parsed: PackageLock): ParsedLock {
  const out = Object.keys(parsed.dependencies).reduce((acc, curr) => {
    const dependency = parsed.dependencies[curr];
    const lockDep = createLockDependency(curr, dependency, parsed.dependencies);
    acc.push(lockDep);

    if (dependency.dependencies) {
      Object.keys(dependency.dependencies).forEach(innerDepKey => {
        const innerDep = dependency.dependencies[innerDepKey];
        if (
          acc.some(
            ({ name, version }) =>
              name === innerDepKey && version === innerDep.version
          )
        ) {
          return;
        }

        acc.push(
          createLockDependency(innerDepKey, innerDep, parsed.dependencies)
        );
      });
    }

    return acc;
  }, [] as ParsedLock);

  return out;
}

/**
 * Parses raw data from a a package-lock.json file into a normalized object.
 *
 * @param data - The raw string data of a package-lock.json file.
 * @returns A normalized object representing the lockfile's dependencies.
 *
 * @internal
 */
function npmParser(data: string): ParsedLock {
  const parsed = JSON.parse(data) as PackageLock;
  return normalizeParsedNPM(parsed);
}

export default npmParser;
