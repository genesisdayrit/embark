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
            <div className="bg-[#FAEDCD] rounded-xl p-4 justify-start flex gap-5 w-150 h-30">
                <p className="border border-2 rounded-xl w-30">item img</p>
                <div className="flex flex-col items-start">
                    <p className="font-bold">Arriving on: {order.estimatedDeliveryDate?.toLocaleString()}</p>
                    <p>item mercant: {order.merchant}</p>
                    <p>tracking number: {order.trackingNumbers} </p>
                </div>
            </div>
        </>
    );
}

export default ItemList;
