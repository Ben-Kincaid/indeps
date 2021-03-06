import { IndepsError } from "src/error";
import { LockDependency, ParsedLock } from "src/parsers";
import sortSpecifications from "src/parsers/utilities/sortSpecifications";

import { YarnV1Lexed } from ".";

const cleanLexem = (lexem: string): string => {
  return lexem.replace(/(^"|"$)/g, "");
};

const parsePackageDeclarations = (
  declarations: Array<string | number | boolean>
): { name: string; specifications: Array<string> } => {
  let packageName = "";
  const packageSpecifications: Array<string> = [];

  declarations.forEach((declaration) => {
    const cleanedDeclaration = cleanLexem(String(declaration));

    const nameMatches = cleanedDeclaration.match(/.+?(?=@)/g);
    const specMatches = cleanedDeclaration.match(/[^@]+$/g);

    if (
      !nameMatches ||
      !specMatches ||
      nameMatches.length > 1 ||
      specMatches.length > 1
    ) {
      throw new IndepsError(
        `There was an error while parsing package name: ${declaration}`
      );
    }

    packageName = nameMatches[0];
    packageSpecifications.push(specMatches[0]);
  });

  return {
    name: packageName,
    specifications: sortSpecifications(packageSpecifications)
  };
};

const yarnV1Parser = (lexed: YarnV1Lexed): ParsedLock => {
  let deps: Array<LockDependency> = [];

  let currentPackage: Partial<LockDependency> | null = null;
  let currentPackageDeclarations: Array<string | number | boolean> =
    [];
  let indentLevel = 0;
  for (let i = 0; i < lexed.length; i++) {
    const prevToken = lexed[i - 1];
    const currentToken = lexed[i];
    const nextToken = lexed[i + 1];

    // if an invalid token was detected in lexed data,
    // throw error
    if (currentToken.type === "INVALID") {
      throw {
        msg: "Syntax Error in lexed data.",
        line: currentToken.position.line,
        col: currentToken.position.col,
        lexem: currentToken.lexem
      };
    }

    // if comment detected, ignore in parsing results
    if (currentToken.type === "COMMENT") {
      continue;
    }

    if (currentToken.type === "INDENT") {
      indentLevel = currentToken.lexem as number;
    }

    if (currentToken.type === "NEWLINE") {
      indentLevel = 0;
    }

    // if string within
    if (currentToken.type === "STRING" && indentLevel === 0) {
      currentPackageDeclarations.push(currentToken.lexem);
    }

    if (currentToken.type === "COLON" && indentLevel === 0) {
      const { name, specifications } = parsePackageDeclarations(
        currentPackageDeclarations
      );

      currentPackage = {
        name,
        specifications
      };
    }

    if (
      currentToken.type === "STRING" &&
      prevToken.type === "INDENT" &&
      indentLevel === 1 &&
      currentPackage
    ) {
      if (currentToken.lexem === "version") {
        currentPackage.version = cleanLexem(
          nextToken.lexem as string
        );
      }
      if (currentToken.lexem === "resolved") {
        currentPackage.resolved = cleanLexem(
          nextToken.lexem as string
        );
      }
      if (currentToken.lexem === "integrity") {
        currentPackage.integrity = cleanLexem(
          nextToken.lexem as string
        );
      }
      if (
        currentToken.lexem === "dependencies" &&
        nextToken.type === "COLON"
      ) {
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
        name: cleanLexem(currentToken.lexem as string),
        range: cleanLexem(nextToken.lexem as string)
      });
    }

    // if new line is met and the next token is string, the previous package object is complete and should be pushed to dependencies array
    if (
      (currentToken.type === "NEWLINE" &&
        nextToken.type === "STRING" &&
        currentPackage) ||
      currentToken.type === "EOF"
    ) {
      if (
        deps.some(
          (dep) =>
            dep.name === currentPackage?.name &&
            dep.version === currentPackage?.version
        )
      ) {
        deps = deps.map((dep) => {
          if (
            currentPackage?.specifications &&
            dep.name === currentPackage.name &&
            dep.version === currentPackage.version
          ) {
            return {
              ...dep,
              specifications: sortSpecifications([
                ...dep.specifications,
                ...currentPackage.specifications
              ])
            };
          } else {
            return dep;
          }
        });
      } else if (currentPackage) {
        deps.push(currentPackage as LockDependency);
      }

      currentPackageDeclarations = [];
      currentPackage = null;
    }

    if (currentToken.type === "EOF") {
      break;
    }
  }
  return deps as Array<LockDependency>;
};

export default yarnV1Parser;
