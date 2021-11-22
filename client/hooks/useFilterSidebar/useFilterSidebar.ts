import { useContext } from "react";
import {
  FilterSidebarContext,
  FilterSidebarState
} from "../../components/FilterSidebar/FilterSidebar";

const useFilterSidebar = (): FilterSidebarState => {
  const { searchValue, filters } = useContext(FilterSidebarContext);
  return { searchValue, filters };
};

export default useFilterSidebar;
