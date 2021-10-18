import { string } from "yargs";
import { ParsedLock } from "..";
import { YarnV1Lexed } from "./";

const cleanLexem = (lexem: string): string => {
  return lexem.replace(/(^\"|\"$)/g, "");
};

const parsePackageTitle = (title: string): { name: string; range: string } => {
  const cleanedTitle = cleanLexem(title);

  const nameMatches = cleanedTitle.match(/.+?(?=@)/g);
  const rangeMatches = cleanedTitle.match(/[^@]+$/g);

  if (
    !nameMatches ||
    !rangeMatches ||
    nameMatches.length > 1 ||
    rangeMatches.length > 1
  ) {
    throw new Error(`There was an error while parsing package name: ${title}`);
  }

  const name = nameMatches[0];
  const range = rangeMatches[0];

  return {
    name,
    range
  };
};

const yarnV1Parser = (lexed: YarnV1Lexed): ParsedLock => {
  const deps: any = {
    type: "yarn",
    version: 1,
    dependencies: []
  };

  let currentPackage: any = null;
  let indentLevel = 0;
  for (var i = 0; i < lexed.length; i++) {
    const prevToken = lexed[i - 1];
    const currentToken = lexed[i];
    const nextToken = lexed[i + 1];

    // if an invalid token was detected in lexed data,
    // throw error
    if (currentToken.type === "INVALID") {
      throw {
        message: "Syntax Error in lexed data.",
        line: currentToken.position.line,
        col: currentToken.position.col,
        lexem: currentToken.lexem
      };
    }

    // if comment detected, ignore in parsing results
    if (currentToken.type === "COMMENT") {
      continue;
    }

    if (currentToken.type === "EOF") {
      break;
    }

    if (currentToken.type === "INDENT") {
      indentLevel = currentToken.lexem as number;
    }

    if (currentToken.type === "NEWLINE") {
      indentLevel = 0;
    }

    // if string following a newline, this is a new package
    if (
      currentToken.type === "STRING" &&
      prevToken.type === "NEWLINE" &&
      nextToken.type === "COLON"
    ) {
      const { name, range } = parsePackageTitle(currentToken.lexem as string);

      currentPackage = {
        package: name,
        range
      };
    }

    if (
      currentToken.type === "STRING" &&
      prevToken.type === "INDENT" &&
      indentLevel === 1 &&
      currentPackage
    ) {
      if (currentToken.lexem === "version") {
        currentPackage.version = cleanLexem(nextToken.lexem as string);
      }
      if (currentToken.lexem === "resolved") {
        currentPackage.resolved = cleanLexem(nextToken.lexem as string);
      }
      if (currentToken.lexem === "integrity") {
        currentPackage.integrity = cleanLexem(nextToken.lexem as string);
      }
      if (currentToken.lexem === "dependencies" && nextToken.type === "COLON") {
        currentPackage.dependencies = [];
      }
    }

    // handle dependencies list
    if (
      currentToken.type === "STRING" &&
      prevToken.type === "INDENT" &&
      nextToken.type === "STRING" &&
      indentLevel === 2 &&
      currentPackage &&
      currentPackage.dependencies
    ) {
      currentPackage.dependencies.push({
        package: cleanLexem(currentToken.lexem as string),
        range: cleanLexem(nextToken.lexem as string)
      });
    }

    // if new line is met and the next token is string, the previous package object is complete and should be pushed to dependencies array
    if (
      currentToken.type === "NEWLINE" &&
      nextToken.type === "STRING" &&
      currentPackage
    ) {
      deps.dependencies.push(currentPackage);
      currentPackage = null;
    }
  }
  return deps;
};

export default yarnV1Parser;
