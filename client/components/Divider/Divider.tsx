import React, { ReactElement } from "react";

import classNames from "classnames";

import styles from "./Divider.module.scss";




interface Props {
  width?: number | string;
  className?: string;
}

function Divider({ className, width }: Props): ReactElement {
  return (
    <div
      className={classNames(styles.divider, className)}
      style={{ width }}
    ></div>
  );
}

export default Divider;
