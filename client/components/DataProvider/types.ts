import { ParsedData } from "src/api";

export interface GlobalData {
  data: ParsedData;
  version: string;
  packageName?: string;
}
