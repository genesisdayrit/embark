import { useState } from "react";
import Nav from "./components/Nav";
import "./App.css";

function Settings() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center w-[90%] m-auto">
        <p className="text-5xl font-bold border-b-1 border-gray-300 w-full p-5">Account Settings</p>
        <div className="flex mt-20 w-full border-b-1 border-gray-300 pb-20">
          <p className="text-4xl font-bold">Account Summary</p>
          <div className="flex flex-col items-start ml-40 text-2xl">
            <p className="font-bold">Account Email</p>
            <p className="text-gray-500">user@emabark.com</p>

            <div className="flex mt-30 gap-30 text-2xl">
              <div>
                <p className="font-bold">Payment Type</p>
                <p className="text-gray-500">Apple card</p>
              </div>

              <div>
                <p className="font-bold">Billing Address</p>
                <p className="text-gray-500">Woodside, NY, USA</p>
              </div>

              <div>
                <p className="font-bold">Country / Region</p>
                <p className="text-gray-500">United States</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
