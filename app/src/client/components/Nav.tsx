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

    const handleSetting = () => {
        navigate('/settings')
    }

    return (
        <>
            <ul className="relative text-2xl font-bold w-full h-20 flex items-center justify-between">
                <li className="pl-20">🦉</li>
                <div className="flex gap-15 p-5">
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-2xl" onClick={handleLogin}>Login</Button>

                    {/* if they log in -> go to checkout page, if they not log in -> log in, if they have no account then sign in first */}
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-2xl">Free 1-month Trial</Button>

                    {/* only shows up when they log in */}
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-2xl">Orders</Button>
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-2xl">Settings</Button>
                </div>
            </ul >
        </>
    );
}

export default Nav;
