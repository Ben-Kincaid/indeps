import { LockDependency, LockType, ParsedLock } from "src/parsers";

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

/**
 * The configuration object for starting the indeps process.
 *
 * @remarks
 * The configuration object for starting the indeps process. This method will parse the dependencies listed in your lockfile and start the HTTP server responsible for serving the indeps client.
 */
export interface StartOpts {
  /** Information about the target lockfile */
  lock: LockInfo;
  /** Information about the target package.json file */
  pkg: PkgInfo;
  /** The port to listen to with the HTTP server. */
  port?: number;
  /** Toggles functionality for opening the browser on server initialization. */
  open?: boolean;
  /** The log level to use for the indeps process. */
  logLevel?: "standard" | "verbose";
}

export interface ParseLockArgs {
  data: string;
  type: LockType;
}
