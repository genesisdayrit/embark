import { useState } from "react";
import { authClient } from "./authclient";
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
  );
}

export default App;
