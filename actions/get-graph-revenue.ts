import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

interface GraphData {
    name: string;
    total: number;
}

// Type for the order data needed for revenue calculations
interface OrderWithItems {
    createdAt: Date;
    orderItems: {
        quantity: number;
        product: {
            price: { toNumber?: () => number } | number;
        };
    }[];
}

// Cached query for paid orders - shared between getTotalRevenue and getGraphRevenue
export const getPaidOrders = unstable_cache(
    async (storeId: string) => {
        return prismadb.order.findMany({
            where: {
                storeId,
                isPaid: true,
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                price: true
                            }
                        }
                    }
                }
            }
        });
    },
    ["paid-orders"],
    { revalidate: 300, tags: ["orders"] } // Cache for 5 minutes
);

export const getGraphRevenue = async (storeId: string) => {
    const paidOrders = await getPaidOrders(storeId);

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders) {
        // Convert string back to Date (unstable_cache serializes dates to strings)
        const createdAt = new Date(order.createdAt);
        const month = createdAt.getMonth();
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
            revenueForOrder += Number(item.product.price) * item.quantity;
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    const graphData: GraphData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
        { name: 'May', total: 0 },
        { name: 'Jun', total: 0 },
        { name: 'Jul', total: 0 },
        { name: 'Aug', total: 0 },
        { name: 'Sep', total: 0 },
        { name: 'Oct', total: 0 },
        { name: 'Nov', total: 0 },
        { name: 'Dec', total: 0 }
    ];

    for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
}