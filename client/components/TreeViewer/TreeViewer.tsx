import React, { ReactElement } from "react";

import UnderDevelopment from "client/components/UnderDevelopment";

import styles from "./TreeViewer.module.scss";

function TreeViewer(): ReactElement {
  return (
    <div className={styles.container}>
      <UnderDevelopment />
    </div>
  );
}

export default TreeViewer;
