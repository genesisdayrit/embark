import { useState } from "react";
import "../App.css";
import { userOrders, getOrderStatus } from "../types";

type ItemListProps = {
    order: userOrders
}

function ItemList({ order }: ItemListProps) {


    console.log("PROPS are ,", order)

    return (
        <>
            <div className="relative w-full bg-[#D4A373] rounded-xl p-4 justify-start flex gap-10 h-55 text-xl">
                <p className="relative border-2 rounded-xl w-100">item img</p>
                <div className="relative w-full flex flex-col items-start gap-3 justify-center">
                    <p className="font-bold">Arriving on: {order.estimatedDeliveryDate?.toLocaleString()}</p>
                    <p>item mercant: {order.merchant}</p>
                    <p>tracking number: {order.trackingNumbers} </p>
                    <p>order date: {order.orderDate?.toLocaleString()}</p>
                    <p>order status: <span className="font-semibold">{getOrderStatus(order)}</span></p>
                </div>
            </div>
        </>
    );
}

export default ItemList;
