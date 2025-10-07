import { useState } from "react";
import { authClient } from "./authclient";
import Signin from "./Signin"
import Dashboard from "./Dashboard";
import "./App.css";

function App() {



  return (
    <>
      <Signin />
      {/* <Dashboard /> */}
    </>
  );
}

export default App;
