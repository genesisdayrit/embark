import { useState } from "react";
import "../App.css";

function ItemList() {
    const [count, setCount] = useState<number>(0);

    return (
        <>
            <div className="bg-[#FAEDCD] rounded-xl p-4 justify-start flex gap-5 w-150 h-30">
                <p className="border border-2 rounded-xl w-30">item img</p>
                <div className="flex flex-col items-start">
                    <p className="font-bold">Arriving on: </p>
                    <p>item name: </p>
                    <p>tracking number: </p>
                </div>
            </div>
        </>
    );
}

export default ItemList;
