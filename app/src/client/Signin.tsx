import { useState } from "react";
import "./App.css";
import { authClient } from "./authclient";
import { Button } from "../components/ui/button"
import Nav from "./components/Nav";

function Signin() {
  const [count, setCount] = useState<number>(0);

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${import.meta.env.VITE_BASE_URL || "http://localhost:3000"}/orders`,
      scopes: ["https://www.googleapis.com/auth/gmail.readonly"]
    });

    return data
  };

  return (
    <>
      <div className="flex flex-col text-3xl w-full items-center mt-50 gap-10">
        <p className="text-4xl">🦉</p>
        <p className="mt-5 text-5xl">Tracking your packages ... </p>
        <p className="text-4xl gap-5">hoot hoot</p>
        <div className="rounded-3xl mt-15 p-5 bg-[#E9EDC9] p-10 text-2xl">
          <div className="mt-2">
            <p>Connect Gmail </p>
            <p>to auto-collect tracking emails.</p>
          </div>
          <button
            onClick={signIn}
            className="inline-flex items-center justify-center gap-2 mt-10 bg-white text-black-800 text-2xl p-5 rounded-4xl transform transition active:scale-105">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="w-5 h-5"
            />
            <span className="text-2xl">Sign in with your Gmail</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Signin;
