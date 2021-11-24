import { useContext } from "react";

import {
  FilterSidebarContext,
  FilterSidebarState
} from "client/components/FilterSidebar";

const useFilterSidebar = (): FilterSidebarState => {
  const { searchValue, filters } = useContext(FilterSidebarContext);
  return { searchValue, filters };
};

export default useFilterSidebar;
