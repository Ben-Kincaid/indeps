import React, { ReactElement, useRef } from "react";

import DataContext from "./DataContext";

interface Props {
  children: React.ReactNode;
}

function DataProvider({ children }: Props): ReactElement {
  const data = useRef(window.indeps__DATA);
  const version = useRef(window.indeps__VERSION);
  const packageName = useRef(window.indeps__PACKAGE_NAME);

  if (!data) {
    throw new Error(
      "No lockdata was found - something went wrong when analyzing your lockfile. Does it have proper syntax?"
    );
  }

  return (
    <DataContext.Provider
      value={{
        data: data.current,
        version: version.current,
        packageName: packageName.current
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
