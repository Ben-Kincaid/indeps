import { useContext } from "react";
import { DataContext } from "../../components/DataProvider";
import { GlobalData } from "../../components/DataProvider/types";

const useData = (): GlobalData => {
  const ctx = useContext(DataContext);
  return ctx as GlobalData;
};

export default useData;
