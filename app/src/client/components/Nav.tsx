import { useState } from "react";
import "../App.css";

function Nav() {
    const [count, setCount] = useState<number>(0);

    return (
        <>
            <ul className="font-bold mt-10 w-full h-20 flex items-center justify-center gap-70 border-b-2">
                <li>🦉</li>
                <div className="flex gap-10">
                    <li className=" p-2 rounded-3xl">Home</li>
                    <li className=" p-2 rounded-3xl">About</li>
                    <li className=" p-2 rounded-3xl">Orders</li>
                </div>

            </ul >
        </>
    );
}

export default Nav;
