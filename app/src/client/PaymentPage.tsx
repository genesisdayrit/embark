import { useState } from "react";
import "./App.css";
import { Button } from "../components/ui/button"

function Payment() {

    return (
        <div className="bg-[#FFFFFF] rounded-4xl p-10 w-140 text-2xl flex flex-col gap-5 border border-gray-200 items-start shadow-lg">
            <p>$0 for 1 month</p>
            <p className="text-4xl font-extrabold">Premium</p>
            <p className="text-4xl font-bold">$0 for 1 month</p>
            <p>$4.99 / month after</p>

            <ul className="font-bold">
                <li> Cancel anytime</li>
            </ul>

            <button className="text-2xl p-5 font-bold rounded-4xl bg-[#CCD5AE] w-full">Try 1 month for $0</button>

            <p className="text-lg text-gray-700">
                15 hours/month of listening time from our audiobooks subscriber catalog
                $0 for 1 month, then $11.99 per month after. Offer only available if you haven't tried Premium before. Terms apply.
            </p>
        </div>
    );
}

export default Payment;
