import { useState } from "react";
import "./App.css";
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Checkout() {

    return (
        <div className="p-10 w-full text-2xl flex flex-col gap-5 items-start justify-start">
            <p>Logo</p>
            <p className="text-4xl font-extrabold">Checkout</p>
            <div className="flex mt-15">
                <p className="text-2xl font-bold">Premium</p>
                <p>$0.00</p>
            </div>

            <div className="flex flex-col items-start">
                <p>Starting Nov 8,2025: $4.99 + tax /month</p>
                <p>We'll remind you 7 days before you're charged.</p>
                <p>Cancel anytime online.</p>
            </div>

        </div>
    );
}

export default Checkout;
