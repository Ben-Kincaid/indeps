type LockType = "npm" | "yarn";

interface LockDependency {
  name: string;
  specifications: Array<string>;
  version: number | string;
  resolved: string;
  integrity: string;
  dependencies?: Array<SubDependency>;
}

interface SubDependency {
  name: string;
  range: string;
}

type ParsedLock = Array<LockDependency>;

export {
  LockType,
  LockDependency,
  ParsedLock,
  SubDependency as LockSubDependency
};
