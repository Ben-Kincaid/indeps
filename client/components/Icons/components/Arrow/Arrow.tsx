import React, { ReactElement } from "react";

import classNames from "classnames";

import styles from "./Arrow.module.scss";

interface Props {
  width: string | number;
  height: string | number;
  dir?: "right" | "left";
  className?: string;
}

function RightArrow({
  width = 200,
  height = 200,
  dir = "right",
  className
}: Props): ReactElement {
  return (
    <svg
      className={classNames(className, {
        [styles.arrowRight]: dir === "right",
        [styles.arrowLeft]: dir === "left"
      })}
      width={width}
      height={height}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 155.139 155.139"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <polygon
            className={styles.polygon}
            points="155.139,77.566 79.18,1.596 79.18,45.978 0,45.978 0,109.155 79.18,109.155 79.18,153.542"
          />
        </g>
      </g>
    </svg>
  );
}

export default RightArrow;
