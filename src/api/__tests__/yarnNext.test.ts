import path from "path";
import fs from "fs";
import { yarnNext } from "../parsers";

describe("yarnNext", () => {
  it("correctly parses package declaration", () => {
    const data = `
"dom-serializer@npm:^1.0.1, dom-serializer@npm:^1.3.2":
    version: 1.3.2
    resolution: "dom-serializer@npm:1.3.2"
    dependencies:
        domelementtype: ^2.0.1
        domhandler: ^4.2.0
        entities: ^2.0.0
    checksum: bff48714944d67b160db71ba244fb0f3fe72e77ef2ec8414e2eeb56f2d926e404a13456b8b83a5392e217ba47dec2ec0c368801b31481813e94d185276c3e964
    languageName: node
    linkType: hard
`;

    const parsed = yarnNext(data);

    expect(parsed).toEqual([
      {
        name: "dom-serializer",
        specifications: ["^1.0.1", "^1.3.2"],
        version: "1.3.2",
        resolved: "dom-serializer@npm:1.3.2",
        integrity:
          "bff48714944d67b160db71ba244fb0f3fe72e77ef2ec8414e2eeb56f2d926e404a13456b8b83a5392e217ba47dec2ec0c368801b31481813e94d185276c3e964",
        dependencies: [
          {
            name: "domelementtype",
            range: "^2.0.1"
          },
          {
            name: "domhandler",
            range: "^4.2.0"
          },
          {
            name: "entities",
            range: "^2.0.0"
          }
        ]
      }
    ]);
  });

  it("correctly parses complete yarn.lock file", () => {
    const lockData = fs.readFileSync(
      path.resolve(__dirname, "./fixtures/yarn.v2.mock.lock"),
      "utf8"
    );

    const parsed = yarnNext(lockData);

    expect(parsed).toEqual([
      {
        name: "fsevents",
        specifications: ["fsevents@^1.2.7#~builtin<compat/fsevents>"],
        version: "1.2.7",
        resolved:
          "fsevents@patch:fsevents@npm%3A1.2.7#~builtin<compat/fsevents>::version=1.2.7&hash=18f3a7",
        integrity: undefined,
        dependencies: [
          {
            name: "nan",
            range: "^2.9.2"
          },
          {
            name: "node-pre-gyp",
            range: "^0.10.0"
          }
        ]
      },
      {
        name: "dom-serializer",
        specifications: ["^1.0.1", "^1.3.2"],
        version: "1.3.2",
        resolved: "dom-serializer@npm:1.3.2",
        integrity:
          "bff48714944d67b160db71ba244fb0f3fe72e77ef2ec8414e2eeb56f2d926e404a13456b8b83a5392e217ba47dec2ec0c368801b31481813e94d185276c3e964",
        dependencies: [
          {
            name: "domelementtype",
            range: "^2.0.1"
          },
          {
            name: "domhandler",
            range: "^4.2.0"
          },
          {
            name: "entities",
            range: "^2.0.0"
          }
        ]
      },
      {
        name: "@strictsoftware/typedoc-plugin-monorepo",
        specifications: [
          "@strictsoftware/typedoc-plugin-monorepo@^0.2.2#./.patches/@strictsoftware/typedoc-plugin-monorepo.patch::locator=%40yarnpkg%2Fgatsby%40workspace%3Apackages%2Fgatsby"
        ],
        version: "0.2.2",
        resolved:
          "@strictsoftware/typedoc-plugin-monorepo@patch:@strictsoftware/typedoc-plugin-monorepo@npm%3A0.2.2#./.patches/@strictsoftware/typedoc-plugin-monorepo.patch::version=0.2.2&hash=916087&locator=%40yarnpkg%2Fgatsby%40workspace%3Apackages%2Fgatsby",
        integrity:
          "a1ce9b8f68a58c3bb735a669c00503317bc31014d0082d67e5537c9f2118e28e746ee9afced53be18e0fa5ff10b0d1fa450eb58676878e3e715332c920956e6d",
        dependencies: [
          {
            name: "highlight.js",
            range: "^9.15.6"
          },
          {
            name: "marked",
            range: "^0.8.0"
          }
        ]
      },
      {
        name: "@actions/core",
        specifications: ["^1.2.6"],
        version: "1.2.6",
        resolved: "@actions/core@npm:1.2.6",
        integrity:
          "f07d105cd5b1d309da8b5c55aad8c92a03915451455f267ac5b03220214d7f7e457b3ac6b874f592e856214491295ae8c106789b2fd5757bfcaf64fe7e0d0546"
      },
      {
        name: "vscode-zipfs",
        specifications: ["packages/vscode-zipfs"],
        version: "0.0.0-use.local",
        resolved: "vscode-zipfs@workspace:packages/vscode-zipfs",
        integrity: undefined,
        dependencies: [
          {
            name: "@rollup/plugin-commonjs",
            range: "^18.0.0"
          },
          {
            name: "@rollup/plugin-node-resolve",
            range: "^11.0.1"
          },
          {
            name: "@types/vscode",
            range: "^1.54.0"
          },
          {
            name: "@yarnpkg/fslib",
            range: "workspace:^"
          },
          {
            name: "@yarnpkg/libzip",
            range: "workspace:^"
          },
          {
            name: "esbuild",
            range: "npm:esbuild-wasm@^0.11.20"
          },
          {
            name: "rollup",
            range: "^2.43.0"
          },
          {
            name: "rollup-plugin-esbuild",
            range: "^3.0.2"
          },
          {
            name: "rollup-plugin-terser",
            range: "^7.0.2"
          },
          {
            name: "tslib",
            range: "^1.13.0"
          },
          {
            name: "vsce",
            range: "^1.85.1"
          }
        ]
      }
    ]);
  });
});
