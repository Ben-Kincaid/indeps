import React, {
  ChangeEvent,
  ReactElement,
  createContext,
  useState
} from "react";

import Input from "client/components/Input";
import FilterItem from "client/components/FilterItem";

import styles from "./FilterSidebar.module.scss";

export interface FilterSidebarState {
  searchValue: string;
  filters: Array<string>;
}

type ChildrenRenderFn = (vals: {
  searchValue: FilterSidebarState["searchValue"];
  filters: FilterSidebarState["filters"];
}) => React.ReactNode;

interface Props {
  children: React.ReactNode | React.ReactNode[] | ChildrenRenderFn;
}

export const FilterSidebarContext = createContext<FilterSidebarState>({
  searchValue: "",
  filters: []
});

function FilterSidebar({ children }: Props): ReactElement {
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<Array<string>>(["TAG_DEPENDENCY"]);

  const handleSearchChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const { value } = evt.target;
    setSearchValue(value);
  };

  const handleFilterItemClick = (value: string) => {
    if (filters.includes(value)) {
      const newFilters = filters.filter(filterItem => value !== filterItem);
      setFilters(newFilters);
    } else {
      setFilters(filters => [...filters, value]);
    }
  };

  return (
    <FilterSidebarContext.Provider value={{ searchValue, filters }}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarSearch}>
              <Input
                id="search"
                name="search"
                type="search"
                value={searchValue}
                placeholder="Search for a dependency..."
                autoComplete="off"
                onChange={handleSearchChange}
                fullWidth
              />
            </div>
            <div className={styles.sidebarFilters}>
              <h5 className={styles.sidebarSectionHeader}>Filters</h5>
              <form className={styles.sidebarFiltersForm}>
                <ul className={styles.sidebarFiltersList}>
                  <FilterItem
                    value="TAG_DEPENDENCY"
                    active={filters.includes("TAG_DEPENDENCY")}
                    label="Project dependencies"
                    onClick={handleFilterItemClick}
                  />
                  <FilterItem
                    value="TAG_DEV_DEPENDENCY"
                    active={filters.includes("TAG_DEV_DEPENDENCY")}
                    label="Development dependencies"
                    onClick={handleFilterItemClick}
                  />
                  <FilterItem
                    value="TAG_SUB_DEPENDENCY"
                    active={filters.includes("TAG_SUB_DEPENDENCY")}
                    label="Sub-dependencies"
                    onClick={handleFilterItemClick}
                  />
                  <FilterItem
                    value="TAG_TS_DEF"
                    active={filters.includes("TAG_TS_DEF")}
                    label="@type packages"
                    onClick={handleFilterItemClick}
                  />
                </ul>
              </form>
            </div>
          </div>
        </aside>
        <div className={styles.content}>
          {typeof children === "function"
            ? (children as ChildrenRenderFn)({ searchValue, filters })
            : children}
        </div>
      </div>
    </FilterSidebarContext.Provider>
  );
}

export default FilterSidebar;
