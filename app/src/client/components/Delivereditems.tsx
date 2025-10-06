import { useState } from "react";
import "../App.css";

function Delivereditems() {
    const [count, setCount] = useState<number>(0);

    return (
        <>
            <div className="bg-[#D4A373] p-4 rounded-xl justify-start flex gap-5 w-150 h-30" >
                <p className="border border-2 rounded-xl w-30" > item img </p>
                < div className="flex flex-col items-start" >
                    <p>item name: </p>
                    <p>delivered on: </p>
                </div>
            </div>
        </>
    );
}

export default Delivereditems;
