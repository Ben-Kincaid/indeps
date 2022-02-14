import React, { ReactElement } from "react";

import classNames from "classnames";

import Divider from "client/components/Divider";

import styles from "./Section.module.scss";

interface Props {
  title: string;
  className?: string;
  children: React.ReactNode | Array<React.ReactNode>;
}

function Section({
  title,
  className,
  children
}: Props): ReactElement {
  return (
    <div className={styles.depsListItemSection}>
      <Divider className={styles.depsListItemSectionDivider} />
      <p className={styles.depsListItemSectionTitle}>{title}</p>
      <ul
        className={classNames(
          styles.depsListItemSectionList,
          className
        )}
      >
        {children}
      </ul>
    </div>
  );
}

export default Section;
