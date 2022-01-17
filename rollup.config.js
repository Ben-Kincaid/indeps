import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const env = process.env.PKG_ENV || "dev";

export default [
  {
    input: `src/index.ts`,
    output: {
      dir: "lib",
      format: "cjs",
      sourcemap: env !== "prod",
      exports: "named",
      name: "main.ts"
    },
    plugins: [
      typescript({
        sourceMap: env !== "prod",
        include: ["./src/**/*"]
      }),
      json(),
      commonjs(),
      nodeResolve()
    ]
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
    plugins: [
      typescript({
        sourceMap: env !== "prod",
        include: ["./src/**/*"]
      }),
      json(),
      commonjs(),
      nodeResolve()
    ]
  }
];
