import React, {
  MouseEventHandler,
  ReactElement,
  useMemo
} from "react";

import classNames from "classnames";

import useElementSize from "client/hooks/useElementSize";
import Grow from "client/components/Grow";
import { FullDependency } from "src/api";
import Arrow from "client/components/Icons/components/Arrow";

import SectionItem from "./components/SectionItem";
import Section from "./components/Section";

import styles from "./DepsListItem.module.scss";

interface Props extends FullDependency {
  active?: boolean;
  style?: React.CSSProperties;
  onClick: MouseEventHandler;
  className?: string;
}

function DepsListItem({
  name,
  paths,
  specifications,
  version,
  dependencies,
  tags, //eslint-disable-line
  style,
  active,
  onClick,
  className
}: Props): ReactElement {
  const [ref, { height }] = useElementSize();

  const normalizedPaths = useMemo(
    () =>
      paths.reduce<
        Array<Array<{ name: string; version: string | null }>>
      >((acc, curr) => {
        const separated = curr.map((pathItem) => {
          const split = pathItem.match(/(.*)@(.*)/);

          return {
            name: !split || split.length !== 3 ? pathItem : split[1],
            version: !split || split.length !== 3 ? null : split[2]
          };
        });

        acc.push(separated.reverse());
        return acc;
      }, []),
    [paths]
  );

  return (
    <article
      className={classNames(styles.item, className)}
      style={style}
    >
      <button className={styles.topBtn} onClick={onClick}>
        <div className={styles.topName}>
          <h3>{name}</h3>
        </div>
        <div className={styles.topMeta}>
          <div className={styles.topMetaItem}>
            <p className={styles.topMetaLabel}>version:</p>
            <p className={styles.topMetaValue}>{version}</p>
          </div>
          <div className={styles.topMetaItem}>
            <p className={styles.topMetaLabel}>dependencies:</p>
            <p className={styles.topMetaValue}>
              {dependencies ? dependencies.length : 0}
            </p>
          </div>
          <div
            className={classNames(styles.topMetaExpand, {
              [styles.topMetaExpandActive]: active
            })}
          >
            <svg
              className={styles.topMetaExpandIcon}
              version="1.1"
              id="Layer_1"
              xmlns="&ns_svg;"
              width="531.74"
              height="359.5"
              viewBox="0 0 531.74 359.5"
            >
              <polygon
                stroke="#000000"
                points="530.874,0.5 265.87,359.5 0.866,0.5 "
              />
            </svg>
          </div>
        </div>
      </button>
      <div className={styles.panel} aria-hidden={!active}>
        <Grow
          height={active ? height || "auto" : 0}
          className={styles.panelGrow}
        >
          <div className={styles.panelInner} ref={ref}>
            <div className={styles.panelContainer}>
              <div className={styles.panelMeta}>
                <div className={styles.panelMetaVersion}>
                  <p className={styles.panelMetaTitle}>Version:</p>
                  <span className={styles.panelMetaValue}>
                    {version}
                  </span>
                </div>
                <div className={styles.panelMetaSpecs}>
                  <p className={styles.panelMetaTitle}>
                    Specifications:
                  </p>
                  <ul className={styles.panelMetaList}>
                    {specifications?.map((specification) => (
                      <li
                        key={specification}
                        className={styles.panelMetaListItem}
                      >
                        <span className={styles.panelMetaValue}>
                          {specification}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {paths && paths.length > 0 && (
                <Section
                  title="Required by:"
                  className={styles.depsListItemSection}
                >
                  {tags.includes("TAG_DEPENDENCY") && (
                    <SectionItem
                      className={styles.depsListItemSectionItem}
                    >
                      <span className={styles.sectionImportantValue}>
                        Project Dependency
                      </span>
                    </SectionItem>
                  )}
                  {tags.includes("TAG_DEV_DEPENDENCY") && (
                    <SectionItem
                      className={styles.depsListItemSectionItem}
                    >
                      <span className={styles.sectionSecondaryValue}>
                        Development Dependency
                      </span>
                    </SectionItem>
                  )}
                  {normalizedPaths.map(
                    (path) =>
                      path.length > 1 && (
                        <SectionItem
                          key={`test123${name}@${version}-${JSON.stringify(
                            path
                          )}`}
                          className={styles.depsListItemSectionItem}
                        >
                          {path.map(({ name, version }, i) => (
                            <React.Fragment
                              key={`${name}@${version}`}
                            >
                              <span
                                className={classNames(
                                  styles.sectionPathValue,
                                  styles.textPrimary
                                )}
                              >
                                {name}
                                <span
                                  className={classNames(
                                    styles.sectionPathVersion,
                                    styles.textGrey
                                  )}
                                >
                                  v{version}
                                </span>
                              </span>
                              {i < path.length - 1 && (
                                <Arrow
                                  className={styles.pathArrow}
                                  width="12px"
                                  height="auto"
                                  dir="right"
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </SectionItem>
                      )
                  )}
                </Section>
              )}

              {dependencies && dependencies.length > 0 && (
                <Section
                  title="Dependencies:"
                  className={styles.depsListItemSection}
                >
                  {dependencies?.map(({ name, range }) => (
                    <SectionItem
                      key={`${name}@${range}`}
                      className={styles.depsListItemSectionItem}
                    >
                      <span className={styles.panelDependencyValue}>
                        <span className={styles.textPrimary}>
                          {name}
                        </span>{" "}
                        {range}
                      </span>
                    </SectionItem>
                  ))}
                </Section>
              )}
            </div>
          </div>
        </Grow>
      </div>
    </article>
  );
}

export default DepsListItem;
