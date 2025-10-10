import { useEffect, useState } from "react";
import "../App.css";
import { authClient } from "../authclient";
import { useNavigate } from "react-router-dom";
import Signin from "../Signin";
import { Button } from "../../components/ui/button"
import { user } from "../../db/auth-schema"


function Nav() {
    const [session, setSession] = useState(null)
    useEffect(() => {
        authClient.getSession().then((data) => {
            setSession(data.data.session)
        })
            .catch((error) => {
                console.log(error)
            })
        setSession(session)
    }, [])

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

    async function logout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigate("/home");
                },
            },
        });
    }
    return (
        <>
            <ul className="relative font-bold w-full h-20 flex items-center justify-between">
                <li className="pl-20 text-4xl">🦉📦</li>
                <div className="flex gap-15 p-5">
                    <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={() => navigate('/home')}>Home</Button>
                    {(!session) && (<Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={handleLogin} >Login</Button>)}

                    {(session) && (<>
                        <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={handleOrders}>Orders</Button>
                        <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={handleSettings}>Settings</Button>
                        <Button className="bg-[#CCD5AE] rounded-4xl p-5 text-xl" onClick={logout}>Log out</Button>
                    </>)}

                </div>
            </ul >
        </>
    );
}

export default Nav;
