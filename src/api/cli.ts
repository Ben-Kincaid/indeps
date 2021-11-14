#!/usr/bin/env node
import startIndeps from "./index";

// @FIX add logic for automatically detecting lock/package.json
// and for arg overrides
startIndeps({
  lock: {
    type: "yarn",
    path: "/Users/benkincaid/Projects/npm-depviz/yarn.lock"
  },
  deps: {
    path: "/Users/benkincaid/Projects/npm-depviz/package.json"
  }
});