import React, { ReactElement } from "react";

import styles from "./Grow.module.scss";

interface Props {
  height: number | "auto";
  children: React.ReactNode | Array<React.ReactNode>;
}

function Grow({ height, children }: Props): ReactElement {
  return (
    <div
      className={styles.grow}
      style={{
        height
      }}
    >
      {children}
    </div>
  );
}

export default Grow;
