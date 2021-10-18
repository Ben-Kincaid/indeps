// possible token types
type TokenBoolean = "BOOLEAN";
type TokenString = "STRING";
type TokenNumber = "NUMBER";
type TokenIdentifier = "IDENTIFIER";
type TokenKeyword = "KEYWORD";
type TokenEOF = "EOF";
type TokenColon = "COLON";
type TokenNewLine = "NEWLINE";
type TokenComment = "COMMENT";
type TokenIndent = "INDENT";
type TokenDedent = "DEDENT";
type TokenInvalid = "INVALID";
type TokenComma = "COMMA";

type TokenTypes =
  | TokenBoolean
  | TokenString
  | TokenNumber
  | TokenIdentifier
  | TokenKeyword
  | TokenEOF
  | TokenColon
  | TokenNewLine
  | TokenComment
  | TokenIndent
  | TokenDedent
  | TokenInvalid
  | TokenComma;

// possible token classes
type CategoryKeyword = "C_KEYWORD"; // names already in the language
type CategoryOperator = "C_OPERATOR"; // symbols that operate on arguments
type CategoryIdentifier = "C_IDENTIFIER"; // names the programmer chooses
type CategoryConstants = "C_CONSTANTS"; // reference literals
type CategoryPunction = "C_PUNCTUATION"; // delimiters and punctuation characters

type CategoryTypes =
  | CategoryKeyword
  | CategoryOperator
  | CategoryIdentifier
  | CategoryConstants
  | CategoryPunction
  | null;

// the token object
interface Token {
  id: string;
  lexem: string | number | boolean;
  position: {
    line: number;
    col: number;
  };
  type: TokenTypes;
  category: CategoryTypes;
}

type LexedLock = Array<Token>;

function computeTokenCategory(type: TokenTypes): CategoryTypes {
  switch (type) {
    case "BOOLEAN":
    case "NUMBER":
    case "STRING": {
      return "C_CONSTANTS";
    }
    case "IDENTIFIER":
      return "C_IDENTIFIER";
    case "COLON":
    case "EOF":
    case "NEWLINE":
    case "INDENT":
    case "DEDENT":
    case "COMMA":
      return "C_PUNCTUATION";
    case "KEYWORD":
      return "C_KEYWORD";
    default:
      return null;
  }
}

function createToken(
  type: TokenTypes,
  line: number,
  col: number,
  value?: string | number | boolean
): Token {
  return {
    id: `${line}-${col}-${type}`,
    lexem: value || "",
    position: {
      line,
      col
    },
    type,
    category: computeTokenCategory(type)
  };
}

function tokenise(input: string): Array<Token> {
  let lastNewLine = false;
  let lastIndentSize = null;
  let line = 1;
  let col = 0;

  let tokens: Array<Token> = [];

  while (input.length) {
    let chop = 0;

    if (input[0] === "\n") {
      // handle new lines/carriage returns
      chop++;
      line++;
      col = 0;
      tokens.push(createToken("NEWLINE", line, col));
    } else if (input[0] === "#") {
      // handle comments
      chop++;
      let nextNewline = input.indexOf("\n", chop);

      if (nextNewline === -1) {
        nextNewline = input.length;
      }

      const val = input.substr(chop, nextNewline);
      chop = nextNewline;
      tokens.push(createToken("COMMENT", line, col, val));
    } else if (input[0] === " ") {
      // handle spaces/indents
      if (lastNewLine) {
        let indentSize = 1;

        for (let i = 1; input[i] === " "; i++) {
          indentSize++;
        }

        if (indentSize % 2) {
          throw new TypeError("Invalid number of spaces");
        } else {
          chop = indentSize;
          if (!lastIndentSize || lastIndentSize < indentSize) {
            tokens.push(createToken("INDENT", line, col, indentSize / 2));
          } else {
            tokens.push(createToken("DEDENT", line, col, indentSize / 2));
          }
        }
      } else {
        chop++;
      }
    } else if (input[0] === '"') {
      // handle commas
      let i = 1;

      for (; i < input.length; i++) {
        if (input[i] === '"') {
          const isEscaped = input[i - 1] === "\\" && input[i - 2] !== "\\";
          if (!isEscaped) {
            i++;
            break;
          }
        }
      }

      const val = input.substring(0, i);
      chop = i;

      tokens.push(createToken("STRING", line, col, val));
    } else if (/^[0-9]/.test(input)) {
      // handle numbers
      const val = /^[0-9]/.exec(input)![0];
      chop = val.length;
      tokens.push(createToken("NUMBER", line, col, Number(val)));
    } else if (/^true/.test(input)) {
      // handle true booleans
      tokens.push(createToken("BOOLEAN", line, col, true));
      chop = 4;
    } else if (/^false/.test(input)) {
      // handle false booleans
      tokens.push(createToken("BOOLEAN", line, col, false));
      chop = 5;
    } else if (input[0] === ":") {
      // handle colons
      tokens.push(createToken("COLON", line, col));
      chop++;
    } else if (input[0] === ",") {
      // handle commas
      tokens.push(createToken("COMMA", line, col));
      chop++;
    } else if (input[0]) {
      // handle all other non-explicit, non-terminal strings
      let i = 0;

      for (; i < input.length; i++) {
        const char = input[i];

        if ([":", ",", " ", "\n", "\r"].includes(char)) {
          break;
        }
      }

      const val = input.substring(0, i);
      chop = i;
      tokens.push(createToken("STRING", line, col, val));
    } else {
      tokens.push(createToken("INVALID", line, col));
    }

    // if no column diffrence was detected, throw invalid token 
    if (!chop) {
      tokens.push(createToken("INVALID", line, col));
    }

    // adjust column to match chop
    col += chop;
    

    lastNewLine = ["\n", "\r"].includes(input[0]) || input[1] === "\n";
    input = input.slice(chop);
  }

  // push an EOF token
  tokens.push(createToken("EOF", line, col));

  // return array of tokens
  return tokens;
}

const yarnV1Lexer = (data: string): LexedLock => {
  const lexed = tokenise(data);
  return lexed;
};

export { LexedLock as YarnV1Lexed };
export default yarnV1Lexer;
