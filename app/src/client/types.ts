export type userOrders = {
    id: string;
    userId: string;
    orderDate: Date;
    shipmentDate: Date | null;
    estimatedDeliveryDate: Date | null;
    actualDeliveryDate: Date | null;
    merchant: string | null;
    orderInfo: unknown;
    lastCommunicationAt: Date | null;
    relatedCommunicationIds: string[] | null;
    trackingUrls: string[] | null;
    trackingNumbers: string[] | null;
    createdAt: Date;
    updatedAt: Date;
}

export type OrderStatus = "Delivered" | "In Transit" | "Order Processing";

export function getOrderStatus(order: userOrders): OrderStatus {
    if (order.actualDeliveryDate) {
        return "Delivered";
    }
    if (order.shipmentDate) {
        return "In Transit";
    }
    return "Order Processing";
}

// Format date like "Thu, Oct 9, 2025"
export function formatDate(date: Date | null | undefined): string {
  if (!date) return "Not available";
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
}