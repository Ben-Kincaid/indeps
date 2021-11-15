import { ParsedLock } from "../api/parsers";

declare global {
  // add typings for server-side injected data
  interface Window {
    indeps__LOCK_DATA: ParsedLock; // the parsed lock data
    indeps__PACKAGE_NAME?: string; // the package name for this analyzation
    indeps__VERSION: string; // the current Indeps version
  }
}
