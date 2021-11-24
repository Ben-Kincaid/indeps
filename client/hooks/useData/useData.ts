import { useContext } from "react";

import { DataContext } from "client/components/DataProvider";
import { GlobalData } from "client/components/DataProvider/types";

const useData = (): GlobalData => {
  const ctx = useContext(DataContext);
  return ctx as GlobalData;
};

export default useData;
