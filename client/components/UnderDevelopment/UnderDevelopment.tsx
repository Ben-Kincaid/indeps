import React, { ReactElement } from "react";

import styles from "./UnderDevelopment.module.scss";

function UnderDevelopment(): ReactElement {
  return (
    <div className={styles.container}>
      <pre className={styles.pre}>
        {`
         ______________
        /             /|
       /             / |
      /____________ /  |
     | ___________ |   |
     ||           ||   |
     ||           ||   |
     ||           ||   |
     ||___________||   |
     |   _______   |  /
    /|  (_______)  | /
   ( |_____________|/
  \.=======================.
  | ::::::::::::::::  ::: |
  | ::::::::::::::[]  ::: |
  |   -----------     ::: |
  \`-----------------------'
        `}
      </pre>
      <h4 className={styles.text}>(under development)</h4>
    </div>
  );
}

export default UnderDevelopment;
