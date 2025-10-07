import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function Signin() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-5xl">🦉</p>
      <p className="mt-5 text-3xl font-bold">Tracking your packages ... </p>
      <p className="text-3xl">hoot hoot</p>
      <div className="w-100 rounded-3xl mt-15 p-5 bg-[#E9EDC9]">
        <p className="mt-2">
          Connect Gmail to auto-collect tracking emails.
        </p>
        <button className="inline-flex items-center justify-center gap-2 mt-4">
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
