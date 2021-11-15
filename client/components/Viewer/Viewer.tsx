import React from "react";
import useData from "../../hooks/useData/useData";
import styles from "./Viewer.module.scss";

const Viewer = () => {
  const { lockData } = useData();

  return (
    <pre className={styles.viewerPre}>
      {JSON.stringify(lockData, null, "\t")}
    </pre>
  );
};

export default Viewer;
