import React, { ReactElement, forwardRef } from "react";

import classNames from "classnames";

import styles from "./Grow.module.scss";

interface Props {
  height: number | "auto";
  children: React.ReactNode | Array<React.ReactNode>;
  className?: string;
}

const Grow = forwardRef<HTMLDivElement, Props>(
  ({ height, className, children }, ref): ReactElement => {
    return (
      <div
        className={classNames(styles.grow, className)}
        ref={ref}
        style={{
          height
        }}
      >
        {children}
      </div>
    );
  }
);

Grow.displayName = "Grow";

export default Grow;
