import React, {
  ReactElement,
  forwardRef,
  useEffect,
  useState,
  useMemo
} from "react";

import classNames from "classnames";
import { Components, ListProps, Virtuoso } from "react-virtuoso";

import { FullDependency, ParsedData } from "src/api";
import useQueryFilter from "client/hooks/useQueryFilter";
import DepsListItem from "client/components/DepsListItem";
import useFilterSidebar from "client/hooks/useFilterSidebar";
import useData from "client/hooks/useData";

import styles from "./DepsList.module.scss";

interface VirtuosoListProps extends ListProps {
  className?: string;
}

const generateInitialActiveStates = (deps: FullDependency[]) => {
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
  const { data } = useData();
  const { searchValue, filters } = useFilterSidebar();

  const { items: deps } = useQueryFilter<FullDependency>(
    searchValue,
    data,
    "name"
  );

  const filteredItems = useMemo(() => {
    if (filters.length === 0) return deps;

    const filtered: ParsedData = [];

    deps.forEach(item => {
      const matched = item.tags.some(tag => filters.includes(tag));
      if (matched) filtered.push(item);
    });

    return filtered;
  }, [deps, filters]);

  const sortedItems = useMemo(() => {
    return filteredItems.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }, [filteredItems]);

  const [activeStates, setActiveStates] = useState(
    generateInitialActiveStates(sortedItems)
  );

  useEffect(() => {
    setActiveStates(generateInitialActiveStates(sortedItems));
  }, [sortedItems]);

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
              {sortedItems.length === 0
                ? "No items found"
                : `${filteredItems.length} Dependencies`}
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
          data={sortedItems}
          itemContent={(index: number, data) => {
            const active = activeStates[index];
            const item = data;
            const {
              name,
              specifications,
              version,
              resolved,
              integrity,
              dependencies,
              tags,
              paths
            } = item;

            return (
              <DepsListItem
                paths={paths}
                onClick={handleItemClick.bind(null, index)}
                active={active}
                name={name}
                specifications={specifications}
                version={version}
                tags={tags}
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
