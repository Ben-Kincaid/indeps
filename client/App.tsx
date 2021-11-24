
import React from "react";

import { HashRouter } from "react-router-dom";

import DataProvider from "./components/DataProvider";
import Viewer from "./components/Viewer";
import NavBar from "./components/NavBar";

import "./app.scss";

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
