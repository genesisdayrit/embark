import { useState } from "react";
import { authClient } from "./authclient";
import Signin from "./Signin"
import Dashboard from "./Dashboard";
import Home from "./home";
import "./App.css";

function App() {

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <>
      <Home />
      <Signin />
      <Dashboard />
    </>
  );
}

export default App;
