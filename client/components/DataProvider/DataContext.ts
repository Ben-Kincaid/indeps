import { createContext } from "react";

import { GlobalData } from "./types";

const context = createContext<Partial<GlobalData>>({});

export default context;
