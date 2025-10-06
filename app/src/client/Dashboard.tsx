import { useState } from "react";
import "./App.css";
import ItemList from "./components/ItemList";
import Delivereditems from "./components/Delivereditems";

function Dashboard() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="mt-10 flex flex-col items-start text-lg">
      <p className="text-3xl font-extrabold">Your Orders</p>
      <p className="text-lg items-i"> # number of deliveries on the way... 🦉 </p>

      <div className="mt-5 flex flex-col items-start gap-5">
        <p className="font-extrabold">Upcoming deliveries</p>
        <ItemList />
        <ItemList />
        <ItemList />
      </div>

      <div className="mt-5 flex flex-col items-start">
        <p className="font-extrabold">Delivery history</p>
        <Delivereditems />
      </div>

    </div>
  );
}

export default Dashboard;
