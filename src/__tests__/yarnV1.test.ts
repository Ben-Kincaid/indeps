import path from "path";
import fs from "fs";

import yarnV1Lexer, {
  createYarnV1LexerToken
} from "../parsers/yarn/yarnV1/yarnV1Lexer";
import yarnV1Parser from "../parsers/yarn/yarnV1/yarnV1Parser";

describe("yarnV1Lexer", () => {
  it("correctly lexes comments", () => {
    const lexed = yarnV1Lexer(`# This is a comment`);

    const commentLexed = [
      createYarnV1LexerToken("COMMENT", 1, 0, "This is a comment"),
      createYarnV1LexerToken("EOF", 1, 19, "")
    ];

    expect(lexed).toEqual(commentLexed);
  });
  it("correctly lexes indent level", () => {
    const lexed = yarnV1Lexer(`
zero indent
    single indent
        double indent
`);

    const indentLexed = [
      createYarnV1LexerToken("NEWLINE", 2, 0, ""),
      createYarnV1LexerToken("STRING", 2, 1, "zero"),
      createYarnV1LexerToken("STRING", 2, 6, "indent"),
      createYarnV1LexerToken("NEWLINE", 3, 0, ""),
      createYarnV1LexerToken("INDENT", 3, 1, 2),
      createYarnV1LexerToken("STRING", 3, 5, "single"),
      createYarnV1LexerToken("STRING", 3, 12, "indent"),
      createYarnV1LexerToken("NEWLINE", 4, 0, ""),
      createYarnV1LexerToken("INDENT", 4, 1, 4),
      createYarnV1LexerToken("STRING", 4, 9, "double"),
      createYarnV1LexerToken("STRING", 4, 16, "indent"),
      createYarnV1LexerToken("NEWLINE", 5, 0, ""),
      createYarnV1LexerToken("EOF", 5, 1, "")
    ];

    expect(lexed).toEqual(indentLexed);
  });

  it("correctly lexes multi-declarations in package names", () => {
    const lexed = yarnV1Lexer(`
indeps@v1.1.0, indeps@v2.2.0, indeps@v3.3.0:
`);

    const multiDecLexed = [
      createYarnV1LexerToken("NEWLINE", 2, 0, ""),
      createYarnV1LexerToken("STRING", 2, 1, "indeps@v1.1.0"),
      createYarnV1LexerToken("COMMA", 2, 14, ","),
      createYarnV1LexerToken("STRING", 2, 16, "indeps@v2.2.0"),
      createYarnV1LexerToken("COMMA", 2, 29, ","),
      createYarnV1LexerToken("STRING", 2, 31, "indeps@v3.3.0"),
      createYarnV1LexerToken("COLON", 2, 44, ":"),
      createYarnV1LexerToken("NEWLINE", 3, 0, ""),
      createYarnV1LexerToken("EOF", 3, 1, "")
    ];

    expect(lexed).toEqual(multiDecLexed);
  });
  it("correctly lexes string in quotations", () => {
    const lexed = yarnV1Lexer(`
"i n s i d e" outside
`);

    const quoteLexed = [
      createYarnV1LexerToken("NEWLINE", 2, 0, ""),
      createYarnV1LexerToken("STRING", 2, 1, "i n s i d e"),
      createYarnV1LexerToken("STRING", 2, 15, "outside"),
      createYarnV1LexerToken("NEWLINE", 3, 0, ""),
      createYarnV1LexerToken("EOF", 3, 1, "")
    ];

    expect(lexed).toEqual(quoteLexed);
  });
});

describe("yarnV1Parser", () => {
  it("correctly parses comments", () => {
    const lexed = yarnV1Lexer(`# This is a comment`);
    const parsed = yarnV1Parser(lexed);

    expect(parsed).toEqual([]);
  });

  it("correctly parses package declaration", () => {
    const lexed = yarnV1Lexer(`
"@babel/code-frame@^7.12.13", "@babel/code-frame@^7.14.5", "@babel/code-frame@^7.15.8":
  version "7.15.8"
  resolved "https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.15.8.tgz#45990c47adadb00c03677baa89221f7cc23d2503"
  integrity sha512-2IAnmn8zbvC/jKYhq5Ki9I+DwjlrtMPUCH/CpHvqI4dNnlwHwsxoIhlc8WcYY5LSYknXQtAlFYuHfqAFCvQ4Wg==
  dependencies:
    "@babel/highlight" "^7.14.5"    
`);
    const parsed = yarnV1Parser(lexed);

    expect(parsed).toEqual([
      {
        name: "@babel/code-frame",
        specifications: ["^7.15.8", "^7.14.5", "^7.12.13"],
        version: "7.15.8",
        resolved:
          "https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.15.8.tgz#45990c47adadb00c03677baa89221f7cc23d2503",
        integrity:
          "sha512-2IAnmn8zbvC/jKYhq5Ki9I+DwjlrtMPUCH/CpHvqI4dNnlwHwsxoIhlc8WcYY5LSYknXQtAlFYuHfqAFCvQ4Wg==",
        dependencies: [
          {
            name: "@babel/highlight",
            range: "^7.14.5"
          }
        ]
      }
    ]);
  });
  it("correctly parses duplicate package declarations (different resolved version)", () => {
    const lexed = yarnV1Lexer(`
json5@2.x, json5@^2.1.2:
  version "2.2.0"
  resolved "https://registry.npmjs.org/json5/-/json5-2.2.0.tgz"
  integrity sha512-f+8cldu7X/y7RAJurMEJmdoKXGB/X550w2Nr3tTbezL6RwEE/iMcm+tZnXeoZtKuOq6ft8+CqzEkrIgx1fPoQA==
  dependencies:
    minimist "^1.2.5"

json5@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/json5/-/json5-1.0.1.tgz"
  integrity sha512-aKS4WQjPenRxiQsC93MNfjx+nbF4PAdYzmd/1JIj8HYzqfbu86beTuNgXDzPknWk0n0uARlyewZo4s++ES36Ow==
  dependencies:
    minimist "^1.2.0"
    `);
    const parsed = yarnV1Parser(lexed);

    expect(parsed).toEqual([
      {
        name: "json5",
        specifications: ["^2.1.2", "2.x"],
        version: "2.2.0",
        resolved:
          "https://registry.npmjs.org/json5/-/json5-2.2.0.tgz",
        integrity:
          "sha512-f+8cldu7X/y7RAJurMEJmdoKXGB/X550w2Nr3tTbezL6RwEE/iMcm+tZnXeoZtKuOq6ft8+CqzEkrIgx1fPoQA==",
        dependencies: [
          {
            name: "minimist",
            range: "^1.2.5"
          }
        ]
      },
      {
        name: "json5",
        specifications: ["^1.0.1"],
        version: "1.0.1",
        resolved:
          "https://registry.npmjs.org/json5/-/json5-1.0.1.tgz",
        integrity:
          "sha512-aKS4WQjPenRxiQsC93MNfjx+nbF4PAdYzmd/1JIj8HYzqfbu86beTuNgXDzPknWk0n0uARlyewZo4s++ES36Ow==",
        dependencies: [
          {
            name: "minimist",
            range: "^1.2.0"
          }
        ]
      }
    ]);
  });
  it("correctly parses duplicate package declarations (same resolved version)", () => {
    const lexed = yarnV1Lexer(`
json5@2.x, json5@^2.1.2:
  version "2.2.0"
  resolved "https://registry.npmjs.org/json5/-/json5-2.2.0.tgz"
  integrity sha512-f+8cldu7X/y7RAJurMEJmdoKXGB/X550w2Nr3tTbezL6RwEE/iMcm+tZnXeoZtKuOq6ft8+CqzEkrIgx1fPoQA==
  dependencies:
    minimist "^1.2.5"

json5@2.2.0:
  version "2.2.0"
  resolved "https://registry.npmjs.org/json5/-/json5-2.2.0.tgz"
  integrity sha512-f+8cldu7X/y7RAJurMEJmdoKXGB/X550w2Nr3tTbezL6RwEE/iMcm+tZnXeoZtKuOq6ft8+CqzEkrIgx1fPoQA==
  dependencies:
    minimist "^1.2.5"
        `);
    const parsed = yarnV1Parser(lexed);

    expect(parsed).toEqual([
      {
        name: "json5",
        specifications: ["2.2.0", "^2.1.2", "2.x"],
        version: "2.2.0",
        resolved:
          "https://registry.npmjs.org/json5/-/json5-2.2.0.tgz",
        integrity:
          "sha512-f+8cldu7X/y7RAJurMEJmdoKXGB/X550w2Nr3tTbezL6RwEE/iMcm+tZnXeoZtKuOq6ft8+CqzEkrIgx1fPoQA==",
        dependencies: [
          {
            name: "minimist",
            range: "^1.2.5"
          }
        ]
      }
    ]);
  });
  it("correctly parses complete yarn.lock file", () => {
    const lockData = fs.readFileSync(
      path.resolve(__dirname, "./fixtures/yarn.v1.mock.lock"),
      "utf8"
    );
    const lexed = yarnV1Lexer(lockData);
    const parsed = yarnV1Parser(lexed);

    expect(parsed).toEqual([
      {
        name: "string-width",
        specifications: ["^4.2.0", "^4.1.0"],
        version: "4.2.3",
        resolved:
          "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
        integrity:
          "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
        dependencies: [
          {
            name: "emoji-regex",
            range: "^8.0.0"
          },
          {
            name: "is-fullwidth-code-point",
            range: "^3.0.0"
          },
          {
            name: "strip-ansi",
            range: "^6.0.1"
          }
        ]
      },
      {
        name: "strip-ansi",
        specifications: ["^6.0.1", "^6.0.0"],
        version: "6.0.1",
        resolved:
          "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
        integrity:
          "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
        dependencies: [
          {
            name: "ansi-regex",
            range: "^5.0.1"
          }
        ]
      },
      {
        name: "tsc",
        specifications: ["^2.0.3"],
        version: "2.0.3",
        resolved:
          "https://registry.yarnpkg.com/tsc/-/tsc-2.0.3.tgz#037fe579e3bd67a5cbdaa604b43c6c1991b04bef",
        integrity:
          "sha512-SN+9zBUtrpUcOpaUO7GjkEHgWtf22c7FKbKCA4e858eEM7Qz86rRDpgOU2lBIDf0fLCsEg65ms899UMUIB2+Ow=="
      },
      {
        name: "typescript",
        specifications: ["^4.4.4"],
        version: "4.4.4",
        resolved:
          "https://registry.yarnpkg.com/typescript/-/typescript-4.4.4.tgz#2cd01a1a1f160704d3101fd5a58ff0f9fcb8030c",
        integrity:
          "sha512-DqGhF5IKoBl8WNf8C1gu8q0xZSInh9j1kJJMqT3a94w1JzVaBU4EXOSMrz9yDqMT0xt3selp83fuFMQ0uzv6qA=="
      }
    ]);
  });
});
