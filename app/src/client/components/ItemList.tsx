import { useState } from "react";
import "../App.css";

function ItemList() {
    const [count, setCount] = useState<number>(0);

    return (
        <>
            <div className="relative w-full bg-[#FAEDCD] rounded-xl p-4 justify-start flex gap-5 h-50">
                <p className="relative border border-2 rounded-xl w-100">item img</p>
                <div className="relative w-full flex flex-col items-start gap-3 justify-center">
                    <p className="font-bold text-2xl">Arriving on: </p>
                    <p>item name: </p>
                    <p>tracking number: </p>
                </div>
            </div>
        </>
    );
}

export default ItemList;
