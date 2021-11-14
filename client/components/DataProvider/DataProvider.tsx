import React, { ReactElement, useRef } from "react";

import DataContext from "./DataContext";

interface Props {
  children: React.ReactNode;
}

function DataProvider({ children }: Props): ReactElement {
  const lockData = useRef(window.lockData);

  return (
    <DataContext.Provider value={{ data: lockData.current }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
