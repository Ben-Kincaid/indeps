import React from "react";

import DataProvider from "./components/DataProvider";
import Viewer from "./components/Viewer";

import "./app.scss";
import NavBar from "./components/NavBar";
import { HashRouter } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <DataProvider>
        <NavBar />
        <Viewer />
      </DataProvider>
    </HashRouter>
  );
}

export default App;
