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
  specifications: Array<string>
): LockDependency {
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
        range: (dependency.requires && dependency.requires[depKey]) ?? ""
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
function normalizeParsedNPM(parsed: PackageLock, pkg: PackageJson): ParsedLock {
  const out = Object.keys(parsed.dependencies).reduce((acc, curr) => {
    const dependency = parsed.dependencies[curr];

    const pkgDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {})
    };

    // get specifications for root-level deps
    const subSpecifications = Object.keys(parsed.dependencies).reduce(
      (acc, d1Key) => {
        const d1 = parsed.dependencies[d1Key];

        if (
          d1.requires &&
          d1.requires[curr] &&
          (!d1.dependencies || !d1.dependencies[curr])
        ) {
          if (
            d1.requires[curr] &&
            (!d1.dependencies || !d1.dependencies[curr])
          ) {
            acc.push(d1.requires[curr]);
          }
        } else if (d1.dependencies && !d1.dependencies[curr]) {
          Object.keys(d1.dependencies).forEach(d2Key => {
            const d2 = d1.dependencies[d2Key];
            if (d2.requires && d2.requires[curr]) {
              acc.push(d2.requires[curr]);
            }
          });
        }

        return acc;
      },
      [] as Array<string>
    );

    // inject pkg dependencies/devDependencies specs to root level dep
    const pkgSpecifications = Object.keys(pkgDeps).reduce<Array<string>>(
      (acc2, curr2) => {
        const pkgDep = pkgDeps[curr2];

        if (curr === curr2) {
          if (pkgDep !== undefined) acc2.push(pkgDep);
        }
        return acc2;
      },
      [] as Array<string>
    );

    const specifications = new Set([
      ...subSpecifications,
      ...pkgSpecifications
    ]);

    // create root-level dep
    const lockDep = createLockDependency(
      curr,
      dependency,
      Array.from(specifications)
    );
    acc.push(lockDep);

    // create deps for required dependencies
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

        const specifications: Array<string> = [];

        if (dependency.requires) {
          if (Object.keys(dependency.requires).includes(innerDepKey)) {
            specifications.push(dependency.requires[innerDepKey]);
          } else {
            const siblingSpecs = Object.keys(dependency.dependencies).reduce<
              Array<string>
            >((acc, dKey) => {
              const d = dependency.dependencies[dKey];
              if (!d.requires) return acc;
              if (Object.keys(d.requires).includes(innerDepKey)) {
                acc.push(d.requires[innerDepKey]);
              }
              return acc;
            }, [] as Array<string>);

            specifications.push(...siblingSpecs);
          }
        }

        acc.push(createLockDependency(innerDepKey, innerDep, specifications));
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
function npmParser(data: string, pkg: PackageJson): ParsedLock {
  const parsed = JSON.parse(data) as PackageLock;
  return normalizeParsedNPM(parsed, pkg);
}

export default npmParser;
