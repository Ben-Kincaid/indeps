import React, { useEffect } from "react";
import useData from "../../hooks/useData";
import styles from "./Viewer.module.scss";

const Viewer = () => {
  const data = useData();

  return (
    <pre className={styles.viewerPre}>{JSON.stringify(data, null, "\t")}</pre>
  );
};

export default Viewer;
