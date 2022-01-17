import { LockDependency, LockType, ParsedLock } from "src/api/parsers";

// Package tag constants
const TAG_DEPENDENCY = "TAG_DEPENDENCY";
const TAG_DEV_DEPENDENCY = "TAG_DEV_DEPENDENCY";
const TAG_TS_DEF = "TAG_TS_DEF";
const TAG_SUB_DEPENDENCY = "TAG_SUB_DEPENDENCY";

export const TAGS: {
  TAG_DEPENDENCY: typeof TAG_DEPENDENCY;
  TAG_DEV_DEPENDENCY: typeof TAG_DEV_DEPENDENCY;
  TAG_TS_DEF: typeof TAG_TS_DEF;
  TAG_SUB_DEPENDENCY: typeof TAG_SUB_DEPENDENCY;
} = {
  TAG_DEPENDENCY,
  TAG_DEV_DEPENDENCY,
  TAG_TS_DEF,
  TAG_SUB_DEPENDENCY
};

// Package tag type
export type PackageTag =
  | typeof TAG_DEPENDENCY
  | typeof TAG_DEV_DEPENDENCY
  | typeof TAG_TS_DEF
  | typeof TAG_SUB_DEPENDENCY;

// Full-featured lock dependency object
export interface FullDependency extends LockDependency {
  paths: Array<Array<string>>;
  tags: Array<PackageTag>;
}

// Full parsed data array
export type ParsedData = Array<FullDependency>;

export interface ParsedDataArgs {
  pkg?: PackageJson;
  lock: ParsedLock;
}

export interface ParsePkgArgs {
  data: string;
}

export interface PkgInfo {
  path: string;
}

export interface LockInfo {
  type: LockType;
  path: string;
}

export interface StartOpts {
  lock: LockInfo;
  pkg: PkgInfo;
  port?: number;
  open?: boolean;
  logLevel?: "none" | "standard" | "verbose";
}

export interface ParseLockArgs {
  data: string;
  type: LockType;
}

export interface StartViewerOpts {
  data: ParsedData;
  indepsVersion: string;
  port: number;
  packageName?: string;
  open?: boolean;
}
