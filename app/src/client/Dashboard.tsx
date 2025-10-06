import { useState } from "react";
import "./App.css";
import ItemList from "./components/ItemList";
import DeliveredItems from "./components/Delivereditems";

function Dashboard() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="mt-10 flex flex-col items-start text-lg">
      <p className="text-3xl font-extrabold">Your Orders🦉📦</p>
      <p className="text-lg"> # number of deliveries on the way... </p>

      <div className="mt-10 flex flex-col items-start gap-5">
        <p className="font-extrabold">Upcoming deliveries</p>
        <ItemList />
        <ItemList />
        <ItemList />
      </div>

      <div className="mt-10 flex flex-col items-start gap-5">
        <p className="font-extrabold">Delivery history</p>
        <DeliveredItems />
      </div>

    </div>
  );
}

export default Dashboard;
