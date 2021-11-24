import React, { forwardRef, ReactElement, useEffect, useState } from "react";
import { LockDependency } from "src/api/parsers";
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

const generateInitialActiveStates = (deps: LockDependency[]) => {
  return deps.map(() => {
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
  const { searchValue } = useFilterSidebar();

  const { items: deps } = useQueryFilter<LockDependency>(
    searchValue,
    lockData,
    "name"
  );

  const [activeStates, setActiveStates] = useState(
    generateInitialActiveStates(deps)
  );

  useEffect(() => {
    setActiveStates(generateInitialActiveStates(deps));
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
          data={deps}
          itemContent={(index: number, data) => {
            const active = activeStates[index];
            const item = data;
            const {
              name,
              specifications,
              version,
              resolved,
              integrity,
              dependencies
            } = item;

            return (
              <DepsListItem
                onClick={handleItemClick.bind(null, index)}
                active={active}
                name={name}
                specifications={specifications}
                version={version}
                resolved={resolved}
                integrity={integrity}
                dependencies={dependencies}
                className={styles.listItem}
              />
            );
          }}
          components={{ List: VirtuosoList }}
        />
      </div>
    </div>
  );
}

export default DepsList;
