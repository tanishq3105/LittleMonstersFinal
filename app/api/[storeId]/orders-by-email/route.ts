import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server'
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;

        // Get email number from query parameters
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return new NextResponse("email number is required", { status: 400, headers: corsHeaders });
        }

        // Verify store belongs to the user
        const store = await prismadb.store.findUnique({
            where: {
                id: storeId,
            }
        });

        if (!store) {
            return new NextResponse("Unauthorized", { status: 403, headers: corsHeaders });
        }

        // Get all orders for this email number in this store
        const orders = await prismadb.order.findMany({
            where: {
                storeId: storeId,
                email: email,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    }
                }
            }
        });
        // Extract and flatten all products from all orders
        const products = orders.flatMap(order =>
            order.orderItems.map(item => ({
                ...item.product,
                quantity: item.quantity,
                orderId: order.id,
                orderCreatedAt: order.createdAt,
                orderPaid: order.isPaid,
            }))
        );

        return NextResponse.json({
            ordersCount: orders.length,
            productsCount: products.length,
            email: email,
            orders: orders,
            products: products,
        }, { headers: corsHeaders });

    } catch (error) {
        console.log('[ORDERS_BY_email_GET]', error);
        return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
    }
}
