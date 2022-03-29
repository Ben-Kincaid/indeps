import { ParsedLock } from "../..";

import lexer from "./yarnV1Lexer";
import parser from "./yarnV1Parser";

const yarnV1 = (data: string): ParsedLock => {
  // lex the lock data
  const lexed = lexer(data);

  // parse & return the parsed lock data
  const parsed = parser(lexed);

  return parsed;
};

export default yarnV1;
