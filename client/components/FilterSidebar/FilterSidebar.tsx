import React, { ChangeEvent, ReactElement, useState } from "react";
import Input from "../Input";
import styles from "./FilterSidebar.module.scss";

export interface FilterSidebarState {
  searchValue: string;
  filters: Array<unknown>;
}

type ChildrenRenderFn = (vals: {
  searchValue: FilterSidebarState["searchValue"];
  filters: FilterSidebarState["filters"];
}) => React.ReactNode;

interface Props {
  children: React.ReactNode | React.ReactNode[] | ChildrenRenderFn;
}

export const FilterSidebarContext = React.createContext<FilterSidebarState>({
  searchValue: "",
  filters: []
});

function FilterSidebar({ children }: Props): ReactElement {
  const [searchValue, setSearchValue] = useState("");
  const [filters] = useState([]);

  const handleSearchChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const { value } = evt.target;
    setSearchValue(value);
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
                onChange={handleSearchChange}
                fullWidth
              />
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
