import { useState } from "react";
import "./App.css";

function Dashboard() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="mt-10 flex flex-col items-start text-lg">
      <p className="text-3xl font-extrabold">Your Orders</p>
      <p className="text-lg items-i"> 🦉 # number of deliveries on the way... 🦉 </p>

      <div className="mt-5 flex flex-col items-start gap-5">
        <p className="font-extrabold">Upcoming deliveries</p>
        <div className="bg-[#FAEDCD] rounded-xl p-2 justify-start flex gap-2 w-150 h-30">
          <p className="border border-2 rounded-xl w-30">item img</p>
          <div className="flex flex-col items-start">
            <p>items name: </p>
            <p>tracking number: </p>
            <p>expected delivery: </p>
          </div>
        </div>

        <div className="bg-[#FAEDCD] rounded-xl p-2 justify-start flex gap-2 w-150 h-30">
          <p className="border border-2 rounded-xl w-30">item img</p>
          <div className="flex flex-col items-start">
            <p>items name: </p>
            <p>tracking number: </p>
            <p>expected delivery: </p>
          </div>
        </div>

        <div className="bg-[#FAEDCD] rounded-xl p-2 justify-start flex gap-2 w-150 h-30">
          <p className="border border-2 rounded-xl w-30">item img</p>
          <div className="flex flex-col items-start">
            <p>items name: </p>
            <p>tracking number: </p>
            <p>expected delivery: </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-start">
        <p className="font-extrabold">Delivery history</p>
        <div className="bg-[#D4A373] p-2 rounded-xl justify-start flex gap-2 w-150 h-30">
          <p className="border border-2 rounded-xl w-30">item img</p>
          <div className="flex flex-col items-start">
            <p>items name: </p>
            <p>delivered on: </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
