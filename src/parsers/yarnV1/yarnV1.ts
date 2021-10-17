import { ParsedLock } from "..";
import lexer from "./yarnV1Lexer";
import parser from "./yarnV1Parser";

const yarnV1 = (data: string) => {
  debugger;
  const lexed = lexer(data);
  debugger;
  const parsed = parser(lexed);
};

export default yarnV1;
