import { ParsedData } from "src/types";

export interface GlobalData {
  data: ParsedData;
  version: string;
  packageName?: string;
}
