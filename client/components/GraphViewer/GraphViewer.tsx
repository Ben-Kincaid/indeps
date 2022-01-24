import React, { ReactElement } from "react";

import UnderDevelopment from "client/components/UnderDevelopment";

import styles from "./GraphViewer.module.scss";

function GraphViewer(): ReactElement {
  return (
    <div className={styles.container}>
      <UnderDevelopment />
    </div>
  );
}

export default GraphViewer;
