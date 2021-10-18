type LockType = "npm" | "yarn";

interface LockDependency {
  package: string;
  version: number | string;
  range: string;
  resolved: string;
  integrity: string;
}

interface LockDependencyFull extends LockDependency {
  requires: LockDependency;
}

interface ParsedLock {
  type: LockType;
  version: number;
  dependencies: Array<Partial<LockDependencyFull>>;
}

export { LockType, LockDependency, LockDependencyFull, ParsedLock };
