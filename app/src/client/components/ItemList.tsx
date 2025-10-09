import { useState } from "react";
import "../App.css";
import { userOrders } from "../types";

type ItemListProps = {
    order: userOrders
}

function ItemList({ order }: ItemListProps) {

    console.log("PROPS are ,", order)

    return (
        <>
            <div className="relative w-full bg-[#FAEDCD] rounded-xl p-4 justify-start flex gap-5 h-70">
                <p className="relative border-2 rounded-xl w-100">item img</p>
                <div className="relative w-full flex flex-col items-start gap-3 justify-center">
                    <p className="font-bold text-xl">Arriving on: {order.estimatedDeliveryDate?.toLocaleString()}</p>
                    <p>item mercant: {order.merchant}</p>
                    <p>tracking number: {order.trackingNumbers} </p>
                </div>
            </div>
        </>
    );
}

export default ItemList;
