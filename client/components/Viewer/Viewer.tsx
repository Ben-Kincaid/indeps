import React from "react";
import { Redirect, Route, Switch } from "react-router";
import useData from "../../hooks/useData/useData";
import ListViewer from "../ListViewer";
import TreeViewer from "../TreeViewer";
import styles from "./Viewer.module.scss";

const Viewer = () => {
  return (
    <main className={styles.main}>
      <Switch>
        <Route path="/tree" component={TreeViewer} />
        <Route path="/list" component={ListViewer} />
        <Route render={() => <Redirect to="/list" />} />
      </Switch>
    </main>
  );
};

export default Viewer;
