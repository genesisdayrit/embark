import { useState } from "react";
import "../App.css";
import { userOrders, getOrderStatus, formatDate } from "../types";

type ItemListProps = {
    order: userOrders
}

function DeliveredItems({ order }: ItemListProps) {   
    return (
        <>
            <div className="relative w-full bg-[#ffffff] shadow-sm border-1 rounded-xl p-4 gap-5 justify-start flex flex-col text-xl">
                <div className="relative w-full flex flex-col items-start justify-center text-base">
                    <p className="font-bold">Delivered</p>
                    <p className="border border-1 w-full mt-5"></p>
                </div>

                <div className="flex text-base">
                    <p className="relative border border-2 rounded-xl w-[30%]">item img</p>
                    <div className="flex flex-col justify-start items-start">
                        <p className="ml-10 font-bold">Delivered on: </p>
                        <p className="ml-10">Merchant: </p>
                        <p className="ml-10">Order #: </p>
                    </div>

                </div>
            </div>
        </>

    );
}

export default DeliveredItems;
