import { useState } from "react";
import "../App.css";
import { authClient } from "../authclient";
import { useNavigate } from "react-router-dom";
import Signin from "../Signin";
import { Button } from "../../components/ui/button"

function Nav() {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/login')
    }

    const handleSettings = () => {
        navigate('/settings')
    }

    const handleOrders = () => {
        navigate('/orders')
    }

    return (
        <>
            <ul className="relative font-bold w-full h-20 flex items-center justify-between">
                <li className="pl-20 text-3xl">🦉📦</li>
                <div className="flex gap-15 p-5">
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={handleLogin} >Login</Button>
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={() => navigate('/home')}>Home</Button>
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={handleSettings}>Settings</Button>

                    {/* only shows up when they log in */}
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={handleOrders}>Orders</Button>
                </div>
            </ul >
        </>
    );
}

export default Nav;
