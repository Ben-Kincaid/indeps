import React, { forwardRef, ReactElement, useEffect, useState } from "react";
import { LockDependency } from "../../api/parsers";
import useData from "../../hooks/useData";
import useFilterSidebar from "../../hooks/useFilterSidebar";
import useQueryFilter from "../../hooks/useQueryFilter";
import DepsListItem from "../DepsListItem";
import styles from "./DepsList.module.scss";
import { Virtuoso, Components, ListProps } from "react-virtuoso";
import classNames from "classnames";

interface VirtuosoListProps extends ListProps {
  className?: string;
}

const Row = ({ index, style, data, active, onClick, className }: any) => {
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
      className={className}
    />
  );
};

const generateActiveStatesFromDeps = (deps: LockDependency[]) => {
  return deps.map((dep, i) => {
    return false;
  });
};

const VirtuosoList: Components["List"] = forwardRef<
  HTMLDivElement,
  VirtuosoListProps
>(({ ...props }, ref) => {
  return (
    <div
      {...props}
      className={classNames(styles.vListWrapper, props.className)}
      ref={ref}
    />
  );
});

VirtuosoList.displayName = "VirtuosoList";

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
    setActiveStates([
      ...activeStates.slice(0, index),
      !activeStates[index],
      ...activeStates.slice(index + 1)
    ]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topWrapper}>
        <div className={styles.topWrapperInner}>
          <div className={styles.badge}>
            <small className={styles.badgeText}>
              (
              {deps.length === 0
                ? "No items found"
                : `${deps.length} Dependencies`}
              )
            </small>
          </div>
        </div>
      </div>
      <div className={styles.listWrapper}>
        <Virtuoso
          style={{
            height: "calc(100vh - 175px)",
            overflowX: "visible"
          }}
          totalCount={deps.length}
          itemContent={(index: number) => {
            const active = activeStates[index];
            return Row({
              index,
              data: deps,
              active,
              onClick: handleItemClick.bind(null, index),
              className: styles.listItem
            });
          }}
          components={{ List: VirtuosoList }}
        />
      </div>
    </div>
  );
}

export default DepsList;
