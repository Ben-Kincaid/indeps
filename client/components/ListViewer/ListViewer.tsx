import React, { ReactElement } from "react";
import DepsList from "../DepsList";
import FilterSidebar from "../FilterSidebar";

function ListViewer(): ReactElement {
  return (
    <FilterSidebar>
      <DepsList />
    </FilterSidebar>
  );
}

export default ListViewer;
