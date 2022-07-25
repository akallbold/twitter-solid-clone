import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import { SessionProvider } from "@inrupt/solid-ui-react";

function App() {
  return (
    <div className="app">
      <SessionProvider>
        <Sidebar />
        <Feed />
        <Widgets />
      </SessionProvider>
    </div>
  );
}

export default App;
