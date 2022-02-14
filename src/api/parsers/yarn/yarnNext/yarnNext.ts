import yaml from "js-yaml";

import { LockDependency } from "src/api/parsers";
import { IndepsError } from "src/error";

import { LockSubDependency, ParsedLock } from "../../types";

interface ParsedPackage {
  version: string | null;
  languageName: string;
  linkType: "HARD" | "SOFT";
  resolution: string;
  checksum: string;
  dependencies: { [key: string]: string };
  peerDependencies: Map<string, string>;
  dependenciesMeta: Map<string, unknown>;
  peerDependenciesMeta: Map<string, unknown>;
}

type ParsedYarnNext = { [key: string]: ParsedPackage };

const normalizeYarnNext = (doc: ParsedYarnNext): ParsedLock => {
  return Object.keys(doc).map((identHash) => {
    const pkg = doc[identHash];
    const specificationNames = identHash.split(", ");
    let name = "";
    const specifications: Array<string> = [];

    specificationNames.forEach((specificationName) => {
      const nameMatches = specificationName.match(/.+?(?=@)/g);
      const specMatches = new RegExp(
        /(@npm:|@workspace:|@patch:)([\s\S]*)$|([^@]*$)/g
      ).exec(specificationName);

      if (!nameMatches || !specMatches) {
        throw new IndepsError(
          `There was an error while parsing package name: ${specificationName}`
        );
      }

      name = nameMatches[0];
      specifications.push(specMatches[3] || specMatches[2]);
    });

    const dependencies = pkg.dependencies
      ? Object.keys(pkg.dependencies).reduce<
          Array<LockSubDependency>
        >((acc, dependencyName) => {
          return [
            ...acc,
            {
              name: dependencyName,
              range: pkg.dependencies[dependencyName]
            }
          ];
        }, [])
      : null;

    return {
      name: name,
      specifications,
      version: pkg.version,
      resolved: pkg.resolution,
      integrity: pkg.checksum,
      ...(dependencies && { dependencies })
    } as LockDependency;
  });
};

const yarnNext = (data: string): ParsedLock => {
  const doc = yaml.load(data) as ParsedYarnNext;
  const filteredDoc = Object.keys(doc).reduce<ParsedYarnNext>(
    (acc, key) => {
      if (key !== "__metadata") {
        acc[key] = doc[key];
      }

      return acc;
    },
    {}
  );

  const normalized = normalizeYarnNext(filteredDoc);
  return normalized;
};

export default yarnNext;
