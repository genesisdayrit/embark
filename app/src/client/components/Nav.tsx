import { useState } from "react";
import "../App.css";
import { authClient } from "../authclient";
import { useNavigate } from "react-router-dom";
import Signin from "../Signin";
import { Button } from "../../components/ui/button"
import { user } from "../../db/auth-schema"

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
                    {(!user.email) && (
                        <>
                            <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-black-800 text-xl hover:text-white" onClick={handleLogin} >Login</Button>
                            <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-black-800 text-xl hover:text-white" onClick={() => navigate('/home')}>Home</Button>
                        </>
                    )}

                    {(user.email) && (
                        <>
                            <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-black-800 text-xl hover:text-white" onClick={() => navigate('/home')}>Home</Button>
                            <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-black-800 text-xl hover:text-white" onClick={handleOrders}>Orders</Button>
                            <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-black-800 text-xl hover:text-white" onClick={handleSettings}>Settings</Button>
                            <Button className="bg-[#CCD5AE] rounded-4xl text-black-80 p-5 text-xl hover:text-white">Log out</Button>
                        </>)}
                </div>
            </ul >
        </>
    );
}

export default Nav;
