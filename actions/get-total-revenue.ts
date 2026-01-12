import { getPaidOrders } from "./get-graph-revenue";

export const getTotalRevenue = async (storeId: string) => {
    const paidOrders = await getPaidOrders(storeId);

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + Number(item.product.price) * item.quantity;
        }, 0);
        return total + orderTotal;
    }, 0);

    return totalRevenue;
}