import React, { ReactElement } from "react";

import classNames from "classnames";

import styles from "./SectionItem.module.scss";

interface Props {
  className?: string;
  children: React.ReactNode | Array<React.ReactNode>;
}

function SectionItem({ className, children }: Props): ReactElement {
  return (
    <li
      className={classNames(
        styles.depsListItemSectionItem,
        className
      )}
    >
      <span className={styles.depsListItemSectionItemValue}>
        {children}
      </span>
    </li>
  );
}

export default SectionItem;
