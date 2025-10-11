import "../App.css";
import { userOrders, formatDate } from "../types";

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

                <div className="flex text-base gap-4">
                    <div className="relative border border-2 rounded-xl w-[20%] h-40 overflow-hidden flex items-center justify-center bg-gray-50">
                        {order.merchantImageUrl && order.merchantImageUrl.trim() !== '' ? (
                            <img
                                src={order.merchantImageUrl}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-gray-400 text-sm">No Image</span>
                        )}
                    </div>
                    <div className="flex flex-col justify-start items-start">
                        {order.orderInfo?.name && (
                            <p className="ml-10 text-lg font-semibold mb-2">{order.orderInfo.name}</p>
                        )}
                        <p className="ml-10 text-xl font-extrabold">Delivered on: {formatDate(order.actualDeliveryDate)}</p>
                        <p className="ml-10">Merchant: {order.merchant || 'N/A'}</p>
                        <p className="ml-10">Order #: {order.merchantOrderNo || 'N/A'}</p>
                    </div>

                </div>
            </div>
        </>

    );
}

export default DeliveredItems;
