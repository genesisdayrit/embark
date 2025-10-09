import { useState } from "react";
import "../App.css";

function DeliveredItems() {
    const [count, setCount] = useState<number>(0);

    return (
        <>
            <div className="relative w-full bg-[#D4A373] rounded-xl p-4 justify-start flex gap-5 h-70">
                <p className="relative border border-2 rounded-xl w-100">item img</p>
                <div className="relative w-full flex flex-col items-start gap-3 justify-center">
                    <p className="font-bold">Delivered on: </p>
                    <p>item name: </p>
                    <p>tracking number: </p>
                    <p></p>
                </div>
            </div>
        </>


    );
}

export default DeliveredItems;
