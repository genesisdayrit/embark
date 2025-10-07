import { useState } from "react";
import "./App.css";
import { authClient } from "./authclient";

function Signin() {
  const [count, setCount] = useState<number>(0);

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });

    return data
  };

  return (
    <div className="flex flex-col">
      <p className="text-5xl">🦉</p>
      <p className="mt-5 text-3xl">Tracking your packages ... </p>
      <p className="text-3xl">hoot hoot</p>
      <div className="rounded-3xl mt-15 p-5 bg-[#E9EDC9]">
        <p className="mt-2">
          Connect Gmail to auto-collect tracking emails.
        </p>
        <button
          onClick={signIn}
          className="inline-flex items-center justify-center gap-2 mt-4">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          <span className="font-medium">Sign in with your Gmail</span>
        </button>
      </div>
    </div>
  );
}

export default Signin;
