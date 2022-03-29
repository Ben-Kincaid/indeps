import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";

import ListViewer from "client/components/ListViewer";
import GraphViewer from "client/components/GraphViewer";

import styles from "./Viewer.module.scss";

const Viewer = () => {
  return (
    <main className={styles.main}>
      <Switch>
        <Route path="/graph" component={GraphViewer} />
        <Route path="/list" component={ListViewer} />
        <Route render={() => <Redirect to="/list" />} />
      </Switch>
    </main>
  );
};

export default Viewer;
