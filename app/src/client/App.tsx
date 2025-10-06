import { useState } from "react";
import { authClient } from "./authclient";
import Signin from "./Signin"
import "./App.css";

function App() {

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div>

      <button onClick={signIn}>Sign In with Google</button>

    </div>
    <>
      <Signin />
    </>
  );
}

export default App;
