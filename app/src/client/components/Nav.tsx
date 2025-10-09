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

    return (
        <>
            <ul className="relative text-2xl font-bold w-full h-20 flex items-center justify-between">
                <li className="pl-20">🦉</li>
                <div className="flex gap-15 p-5">
                    <button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl text-black-800" onClick={handleLogin} >Login</button>
                    <button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl text-black-800" onClick={() => navigate('/home')}>Home</button>
                    {/* <button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl text-black-800" >About</button> */}
                    {/* <button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl text-black-800">Orders</button> */}
                    <button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl text-black-800" onClick={handleSettings}>Settings</button>
                </div>

            </ul >
        </>
    );
}

export default Nav;
