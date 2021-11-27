import React, { MouseEventHandler, ReactElement } from "react";

import classNames from "classnames";

import { LockDependency } from "src/api/parsers";
import useElementSize from "client/hooks/useElementSize";
import Divider from "client/components/Divider";
import Grow from "client/components/Grow";

import styles from "./DepsListItem.module.scss";

interface Props extends LockDependency {
  active?: boolean;
  style?: React.CSSProperties;
  onClick: MouseEventHandler;
  className?: string;
}

function DepsListItem({
  name,
  specifications,
  version,
  dependencies,
  style,
  active,
  onClick,
  className
}: Props): ReactElement {
  const [ref, { height }] = useElementSize();

  return (
    <article className={classNames(styles.item, className)} style={style}>
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
                  <span className={styles.panelMetaValue}>{version}</span>
                </div>
                <div className={styles.panelMetaSpecs}>
                  <p className={styles.panelMetaTitle}>Specifications:</p>
                  <ul className={styles.panelMetaList}>
                    {specifications?.map(specification => (
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

              {dependencies && dependencies.length > 0 && (
                <>
                  <Divider className={styles.panelDivider} />
                  <div className={styles.panelDependencies}>
                    <p className={styles.panelMetaTitle}>Dependencies:</p>
                    <ul className={styles.panelMetaList}>
                      {dependencies?.map(({ name, range }) => (
                        <li key={name} className={styles.panelMetaListItem}>
                          <span className={styles.panelDependencyValue}>
                            <span className={styles.textGrey}>{name}</span>{" "}
                            {range}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </Grow>
      </div>
    </article>
  );
}

export default DepsListItem;
