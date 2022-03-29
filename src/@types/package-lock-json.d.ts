interface PackageLockPackage {
  version: string;
  resolved: string;
  integrity: string;
  link: boolean;
  dev?: boolean;
  inBundle: boolean;
  hasInstallScript: boolean;
  hasShrinkwrap: boolean;
  bin?: string;
  license?: string;
  engines?: {
    node?: string;
    [k: string]: string | undefined;
  };
  dependencies?: {
    [k: string]: string;
  };
  optionalDependencies?: {
    [k: string]: string | undefined;
  };
}

interface PackageLockDependencyBase {
  version: string;
  integrity: string;
  resolved: string;
  bundled?: boolean;
  dev?: boolean;
  optional?: boolean;
  requires?: {
    [k: string]: string;
  };
}

interface PackageLockDependency extends PackageLockDependencyBase {
  dependencies: {
    [k: string]: PackageLockDependencyBase;
  };
}

interface PackageLock {
  name: string;
  version: string;
  lockfileVersion: number;
  packages: {
    [k: string]: PackageLockPackage;
  };
  dependencies: {
    [k: string]: PackageLockDependency;
  };
}

declare global {
  type PackageLockDependency = PackageLockDependency;
  type PackageLock = PackageLock;
}
