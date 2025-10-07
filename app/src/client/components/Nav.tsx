import { useState } from "react";
import "../App.css";
import { authClient } from "../authclient";
import { useNavigate } from "react-router-dom";
import Signin from "../Signin";

function Nav() {
    const [count, setCount] = useState<number>(0);
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/login')
    }

    return (
        <>
            <ul className="relative text-[20px] font-bold w-full h-20 flex items-center justify-between">
                <li className="pl-20">🦉</li>
                <div className="flex gap-20 pr-20">
                    <button onClick={handleLogin} className=" p-2 rounded-3xl">Login</button>
                    <button className=" p-2 rounded-3xl">Home</button>
                    <button className=" p-2 rounded-3xl">About</button>
                    <button className=" p-2 rounded-3xl">Orders</button>
                </div>

            </ul >
        </>
    );
}

export default Nav;
