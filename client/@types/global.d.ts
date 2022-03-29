import { ParsedData } from "src/types";

declare global {
  // add typings for server-side injected data
  interface Window {
    indeps__DATA: ParsedData; // the parsed lock data
    indeps__PACKAGE_NAME?: string; // the package name for this analyzation
    indeps__VERSION: string; // the current Indeps version
  }
}
