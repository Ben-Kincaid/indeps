import { useContext } from "react";
import { DataContext } from "../components/DataProvider";

const useData = () => {
  const ctx = useContext(DataContext);

  return ctx.data;
};

export default useData;
