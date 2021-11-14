import React from "react";
import { ParsedLock } from "../../api/parsers";

const context = React.createContext<{ data: ParsedLock | null }>({
  data: null
});

export default context;
