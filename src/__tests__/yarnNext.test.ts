import path from "path";
import fs from "fs";

import { getFixture } from "src/__tests__/utils";

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

    const parsed = yarnNext(data, { name: "" });

    expect(parsed).toEqual([
      {
        name: "dom-serializer",
        specifications: ["^1.3.2", "^1.0.1"],
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

    const parsed = yarnNext(lockData, { name: "" });

    expect(parsed).toEqual([
      {
        name: "fsevents",
        specifications: [
          "patch:fsevents@^1.2.7#~builtin<compat/fsevents>"
        ],
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
        specifications: ["^1.3.2", "^1.0.1"],
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
          "patch:@strictsoftware/typedoc-plugin-monorepo@^0.2.2#./.patches/@strictsoftware/typedoc-plugin-monorepo.patch::locator=%40yarnpkg%2Fgatsby%40workspace%3Apackages%2Fgatsby"
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
        specifications: ["workspace:packages/vscode-zipfs"],
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
  it("correctly ignores local project package entry", () => {
    const lockData = getFixture("yarn.v2--local-proj.mock.lock");

    const parsed = yarnNext(lockData, { name: "my-package" });

    expect(parsed).toEqual([
      {
        name: "st-jss",
        integrity:
          "bff48714944d67b160db71ba244fb0f3fe72e77ef2ec8414e2eeb56f2d926e404a13456b8b83a5392e217ba47dec2ec0c368801b31481813e94d185276c3e964",
        resolved: "st-jss@npm:1.0.5",
        specifications: ["^1.0.5"],
        version: "1.0.5"
      },
      {
        name: "vscode-zipfs",
        integrity: undefined,
        resolved: "vscode-zipfs@workspace:packages/vscode-zipfs",
        specifications: ["workspace:packages/vscode-zipfs"],
        version: "0.0.0-use.local"
      }
    ]);
  });
  it("correctly parses non-semver package declarations", () => {
    const lockData = getFixture("yarn.v2--non-semver.mock.lock");

    const parsed = yarnNext(lockData, { name: "some-project" });

    expect(parsed).toEqual([
      {
        name: "@types/asn1-parser",
        version: "1.1.8",
        resolved: "asn1-parser@npm:1.1.8",
        integrity:
          "66956cc3097227a6598453e22c307fa03083d2084712376b811987cae85f3681e55908410f0a4210c6d06d4b96ab6048ccbb7feedcb5a01a7e4cc56a0a55e1e8",
        specifications: ["^1.1.8"]
      },
      {
        name: "bluecrypt-ssh-to-jwk",
        version: "1.0.3",
        resolved: "bluecrypt-ssh-to-jwk@npm:1.0.3",
        integrity:
          "84e14a3f18fca45406f075d646c0eaaf3b1bbeae0bcaea97f71315678d13e81ff02b84cf4211941daeabe6fefc13473bf0c51c50166f2e6a250260951a6d7b13",
        specifications: ["portal:./some-project"]
      },
      {
        name: "detector-js",
        version: "1.3.2",
        resolved: "detector-js@npm:1.3.2",
        integrity:
          "fa0e08aab476181ca55eb0b02ac46096ad5e922f46eadb0eec69b382622162b74a0784613850248b074edb64b66b428eb30db2c3c0ab79ffcc894f131499c8f0",
        specifications: ["^1.3.0"]
      },
      {
        name: "gotjs",
        version: "0.0.10-1",
        resolved: "gotjs@npm:0.0.10-1",
        integrity:
          "91e04d18e7968ec88e4344b4e36e00dca4d259abe36f13bd280c2f6204fb1347b603a71c640a667bfde92efaaf843a53c8e259929267fbf7b40778b352071730",
        specifications: ["exec:./some-generator-project"]
      },
      {
        name: "jwk-to-ssh",
        version: "1.2.0",
        resolved: "jwk-to-ssh@npm:1.2.0",
        integrity:
          "25e3676c36ddbe51ff2b29d0282034c3653ba646bb1ebc5045c847deb888606202334954f3d7e4c4eefab1fdb29889a157a32d58446d613f2c48f88bd4d6f54b",
        specifications: ["latest"]
      },
      {
        name: "rasha",
        version: "1.2.5",
        resolved: "rasha@npm:1.2.5",
        integrity:
          "b0e8911b58f061452b6270928051957bb26a16cdd3cd5c0799c7d86ccc660abe8e965338f9835e5a5ad154f1213dd85f4064e6866bc5a039dc9a354652eeb6a3",
        specifications: ["git@github.com:some/project"]
      },
      {
        name: "rsa-csr",
        version: "1.0.6",
        resolved: "rsa-csr@npm:1.0.6",
        integrity:
          "6f2eb7525aa78b759fe5cabe6135e1c197fcfd94fb8b5fce3dc2e8fa877b0360937857e8f24a147d91c4e031d024198966017ce7fad35d95d2625785897f58b2",
        specifications: ["github:foo/bar"]
      },
      {
        name: "search-summary",
        version: "1.1.1",
        resolved: "search-summary@npm:1.1.1",
        integrity:
          "69ab5ca76e15ccebdef95caaa507ac8964ebcb0e303f9c0291055b1fa610901d405c5f32952e3bc9b878dcada67842a368a4f637e5b3096611f00b91a761f941",
        specifications: [
          "patch:search-summary@1.1.1#./some-project.patch"
        ]
      },
      {
        name: "utilist",
        version: "2.2.0",
        resolved: "utilist@npm:2.2.0",
        integrity:
          "7b70e3283d242937a442566566d849aae1e2a238cd20d506ec9751ca9080adb01cca8b86288308210ba7713671322ee26f9801d21e1238555a9aef4625174158",
        specifications: ["file:./some-file"]
      },
      {
        name: "vanilla-tabs",
        version: "0.1.0",
        resolved: "vanilla-tabs@npm:0.1.0",
        integrity:
          "ad38fe5c252a10c7748ed08b45d815f52aedc1f7cd40b4480c80c9d5585439b34d019738e015821916e88e33b188942d2319d3593433606073580d6afcb120ad",
        specifications: ["link:./some-project"]
      }
    ]);
  });
});
