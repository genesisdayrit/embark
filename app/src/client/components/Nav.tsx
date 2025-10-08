import { useState } from "react";
import "../App.css";
import { authClient } from "../authclient";
import { useNavigate } from "react-router-dom";
import Signin from "../Signin";
import { Button } from "../../components/ui/button"

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
                <div className="flex gap-15 p-5">
                    <Button className="bg-[#CCD5AE] rounded-4xl p-7 text-xl text-black-800" onClick={handleLogin} >Login</Button>
                    <Button className="bg-[#CCD5AE] rounded-4xl p-7 text-xl text-black-800" >Home</Button>
                    <Button className="bg-[#CCD5AE] rounded-4xl p-7 text-xl text-black-800" >About</Button>
                    <Button className="bg-[#CCD5AE] rounded-4xl p-7 text-xl text-black-800">Orders</Button>
                    <Button className="bg-[#CCD5AE] rounded-4xl p-7 text-xl text-black-800">Settings</Button>
                </div>

            </ul >
        </>
    );
}

export default Nav;
