import React from "react";

import DataProvider from "./components/DataProvider";
import Viewer from "./components/Viewer";

import "./app.scss";
import NavBar from "./components/NavBar";

function App() {
  return (
    <DataProvider>
      <NavBar />
      <Viewer />
    </DataProvider>
  );
}

export default App;
