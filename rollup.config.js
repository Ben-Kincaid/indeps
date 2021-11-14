import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const env = process.env.PKG_ENV || "dev";

export default [
  {
    input: `src/index.ts`,
    output: {
      dir: "lib",
      format: "cjs",
      sourcemap: env !== "prod",
      exports: "default",
      name: "main.ts"
    },
    plugins: [typescript(), commonjs(), nodeResolve()]
  },
  {
    input: `src/cli.ts`,
    output: {
      banner: "#!/usr/bin/env node",
      dir: "lib",
      format: "cjs",
      sourcemap: env !== "prod",
      exports: "none",
      name: "main.ts"
    },
    plugins: [typescript(), commonjs(), nodeResolve()]
  }
];
