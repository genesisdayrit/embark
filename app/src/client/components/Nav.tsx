import { useState } from "react";
import "../App.css";

function Nav() {
    const [count, setCount] = useState<number>(0);

    return (
        <>
            <ul className="relative text-[20px] font-bold w-full h-20 flex items-center justify-between">
                <li className="pl-20">🦉</li>
                <div className="flex gap-20 pr-20">
                    <li className=" p-2 rounded-3xl">Home</li>
                    <li className=" p-2 rounded-3xl">About</li>
                    <li className=" p-2 rounded-3xl">Orders</li>
                </div>

            </ul >
        </>
    );
}

export default Nav;
