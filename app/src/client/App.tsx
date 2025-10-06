import { useState } from "react";
import Signin from "./Signin"
import "./App.css";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <Signin />
    </>
  );
}

export default App;
