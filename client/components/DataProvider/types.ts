import { ParsedLock } from "src/api/parsers";

export interface GlobalData {
  lockData: ParsedLock;
  version: string;
  packageName?: string;
}
