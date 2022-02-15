import { LockType } from "src/parsers/types";

export default function getLockTypeFromPath(
  path: string
): LockType | null {
  if (path.endsWith("yarn.lock")) return "yarn";
  if (path.endsWith("package-lock.json")) return "npm";
  return null;
}
