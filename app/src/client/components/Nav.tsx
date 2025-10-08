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

    const handleSetting = () => {
        navigate('/settings')
    }

    return (
        <>
            <ul className="relative text-[20px] font-bold w-full h-20 flex items-center justify-between">
                <li className="pl-20">🦉</li>
                <div className="flex gap-10 pr-20">
                    <button onClick={handleLogin} >Login</button>
                    <button >Home</button>
                    <button >About</button>
                    <button >Orders</button>
                    <button >Settings</button>
                </div>

            </ul >
        </>
    );
}

export default Nav;
