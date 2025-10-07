import { useState } from "react";
import { authClient } from "./authclient";
import Signin from "./Signin"
import Dashboard from "./Dashboard";
import Home from "./home";
import "./App.css";

function App() {



  return (
    <>
      <Home />
      <Signin />
      {/* <Dashboard /> */}
    </>
  );
}

export default App;
