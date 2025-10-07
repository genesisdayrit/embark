import { useState } from "react";
import "./App.css";
import ItemList from "./components/ItemList";
import DeliveredItems from "./components/Delivereditems";
import Nav from "./components/Nav";

async function Dashboard() {


  return (
    <>
      <div className="relative w-full">
        <Nav />
        <div className="w-full">
          <div className="mt-5 flex flex-col items-start text-lg">
            <p className="text-4xl font-extrabold">Your Orders🦉📦</p>
            <p className="text-lg"> # number of deliveries on the way... </p>

            <div className="w-full mt-10 flex flex-col items-start gap-5">
              <p className="font-extrabold text-3xl">Upcoming deliveries</p>
              <ItemList />
              <ItemList />
              <ItemList />
            </div>

            <div className="w-full mt-10 flex flex-col items-start gap-5">
              <p className="font-extrabold text-3xl">Delivery history</p>
              <DeliveredItems />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
