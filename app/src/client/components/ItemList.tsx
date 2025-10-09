import { useState } from "react";
import "../App.css";
import { userOrders, getOrderStatus, formatDate } from "../types";

type ItemListProps = {
    order: userOrders
}

function ItemList({ order }: ItemListProps) {
    console.log("PROPS are ,", order)

    return (
        <>
            <div className="relative w-full bg-[#ffffff] shadow-sm border-1 rounded-xl p-4 gap-5 justify-start flex flex-col text-xl">
                <div className="relative w-full flex flex-col items-start justify-center text-base">
                    <p className="font-bold">Tracking #: {order.trackingNumbers}</p>
                    <p className="border border-1 w-full mt-2 mb-5"></p>
                    <p>Status: </p>
                    <p>Arriving on: {order.estimatedDeliveryDate?.toLocaleString()}</p>
                    <p>Item Merchant: {order.merchant}</p>
                    <p className="border border-1 w-full mt-5"></p>
                </div>

                <div className="flex text-base">
                    <p className="relative border border-2 rounded-xl w-[40%] h-30">item img</p>
                    <div className="flex flex-col justify-start items-start">
                        <p className="ml-10 font-bold">product name goes here</p>
                        <p className="ml-10">product</p>
                        <p className="ml-10">details</p>
                        <p className="ml-10">maybe?</p>
                    </div>

            <div className="relative w-full bg-[#D4A373] rounded-xl p-4 justify-start flex gap-10 h-55 text-xl">
                <p className="relative border-2 rounded-xl w-100">item img</p>
                <div className="relative w-full flex flex-col items-start gap-3 justify-center">
                    <p className="font-bold">Arriving on: {formatDate(order.estimatedDeliveryDate)}</p>
                    <p>item mercant: {order.merchant}</p>
                    <p>tracking number: {order.trackingNumbers} </p>
                    <p>order date: {formatDate(order.orderDate)}</p>
                    <p>order status: <span className="font-semibold">{getOrderStatus(order)}</span></p>
                </div>
            </div>
        </>
    );
}

export default ItemList;
