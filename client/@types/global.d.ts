import { ParsedLock } from "../api/parsers";

declare global {
  // add typings for SSR data injected into window
  interface Window {
    lockData: ParsedLock;
  }
}
