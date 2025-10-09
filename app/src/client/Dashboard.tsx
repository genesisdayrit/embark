import { useEffect, useState } from "react";
import "./App.css";
import ItemList from "./components/ItemList";
import DeliveredItems from "./components/Delivereditems";
import Nav from "./components/Nav";
import type { userOrders } from "./types";

function Dashboard() {

  const [orders, setOrders] = useState<userOrders[]>([])

  useEffect(() => {
    fetch(`/api/orders`)
      .then(response => response.json())
      .then(data => { setOrders(data), console.log('Got data ', data) })
      .catch(_e => { throw Error("Could not get user orders from server") })
  }, [])

  console.log("dashboard has orders", orders)
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center m-auto w-[60%]">
        <p className="text-4xl font-bold border-b-1 border-gray-300 w-full p-20">Your Orders</p>

        <div className="text-2xl w-full mt-10 flex flex-col items-start gap-5">
          <p className="font-extrabold ">Upcoming deliveries</p>
          {orders.map((order) => <ItemList order={order} />)}
        </div>

        {/* <div className="text-2xl w-full mt-10 flex flex-col items-start gap-5">
          <p className="font-extrabold ">Delivery history</p>
          <DeliveredItems />
        </div> */}
      </div>

    </>
  );
}

export default Dashboard;
