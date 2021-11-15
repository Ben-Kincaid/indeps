import { ParsedLock } from "../../api/parsers";

export interface GlobalData {
  lockData: ParsedLock;
  version: string;
  packageName?: string;
}
