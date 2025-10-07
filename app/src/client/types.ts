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