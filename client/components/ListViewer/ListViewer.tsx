import React, { ReactElement } from "react";

import DepsList from "client/components/DepsList";
import FilterSidebar from "client/components/FilterSidebar";

function ListViewer(): ReactElement {
  return (
    <FilterSidebar>
      <DepsList />
    </FilterSidebar>
  );
}

export default ListViewer;
