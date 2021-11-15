import React from "react";
import { GlobalData } from "./types";

const context = React.createContext<Partial<GlobalData>>({});

export default context;
