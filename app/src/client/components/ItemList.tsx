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
                    <p>Status: {getOrderStatus(order)}</p>
                    <p>Estimated Delivery Date: {formatDate(order.estimatedDeliveryDate)}</p>
                    <p>Item Merchant: {order.merchant}</p>
                    <p className="border border-1 w-full mt-5"></p>
                </div>

                <div className="flex text-base items-start">
                    <p className="relative border border-2 rounded-xl w-[30%] h-30">item img</p>
                    <div className="flex flex-col justify-start items-start">
                        {order.trackingUrls && order.trackingUrls.length > 0 ? (
                            <a
                                href={order.trackingUrls[0]}
                                target="_blank"
                                className="text-blue-600 underline"
                            >
                                Track your package
                            </a>
                        ) : (
                            <span></span>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default ItemList;
