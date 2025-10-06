import { useState } from "react";
import Signin from "./Signin"
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <Signin />
      <Dashboard />
    </>
  );
}

export default App;
