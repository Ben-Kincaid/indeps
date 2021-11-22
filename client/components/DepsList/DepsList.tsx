import React, { ReactElement, useEffect, useState } from "react";
import { LockDependency } from "../../api/parsers";
import useData from "../../hooks/useData";
import useFilterSidebar from "../../hooks/useFilterSidebar";
import useQueryFilter from "../../hooks/useQueryFilter";
import DepsListItem from "../DepsListItem";
import styles from "./DepsList.module.scss";
import { Virtuoso } from "react-virtuoso";

const Row = ({ index, style, data, active, onClick }: any) => {
  const item = data[index];

  const { name, specifications, version, resolved, integrity, dependencies } =
    item;

  return (
    <DepsListItem
      onClick={onClick}
      active={active}
      style={style}
      name={name}
      specifications={specifications}
      version={version}
      resolved={resolved}
      integrity={integrity}
      dependencies={dependencies}
    />
  );
};

const generateActiveStatesFromDeps = (deps: LockDependency[]) => {
  return deps.map((dep, i) => {
    return false;
  });
};

function DepsList(): ReactElement {
  const { lockData } = useData();
  const { searchValue, filters } = useFilterSidebar();

  const { items: deps } = useQueryFilter<LockDependency>(
    searchValue,
    lockData,
    "name"
  );

  const [activeStates, setActiveStates] = useState(
    generateActiveStatesFromDeps(deps)
  );

  useEffect(() => {
    setActiveStates(generateActiveStatesFromDeps(deps));
  }, [deps]);

  const handleItemClick = (index: number) => {
    console.log(`Clicked: ` + index);

    setActiveStates([
      ...activeStates.slice(0, index),
      !activeStates[index],
      ...activeStates.slice(index + 1)
    ]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.badge}>
        <small className={styles.badgeText}>
          (
          {deps.length === 0 ? "No items found" : `${deps.length} Dependencies`}
          )
        </small>
      </div>
      <Virtuoso
        style={{
          height: "calc(100vh - 140px)",
          overflowX: "visible"
        }}
        totalCount={deps.length}
        itemContent={(index: number) => {
          const active = activeStates[index];
          return Row({
            index,
            data: deps,
            active,
            onClick: handleItemClick.bind(null, index)
          });
        }}
      />
    </div>
  );
}

export default DepsList;
