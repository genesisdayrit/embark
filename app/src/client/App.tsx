import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="App">
      <p className="text-6xl">🦉</p>
      <p className="text-4xl">Tracking your packages ...</p>
    </div>
  );
}

export default App;
