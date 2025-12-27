import prismadb from "@/lib/prismadb";
import razorpay from "@/lib/razorpay";
import { NextResponse, NextRequest } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ storeId: string }> }) {
    try {
        const body = await req.json();
        const { storeId } = await params;

        // Destructure the new format from frontend
        const { items, phone, address } = body;

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json(
                { success: false, error: "Items are required" },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!phone || !address) {
            return NextResponse.json(
                { success: false, error: "Phone and address are required" },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!storeId) {
            return NextResponse.json(
                { success: false, error: "Store ID is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Verify products exist and calculate total
        const productIds = items.map((item: any) => item.productId);
        const products = await prismadb.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });

        if (products.length !== productIds.length) {
            return NextResponse.json(
                { success: false, error: "Some products not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        // Calculate total amount based on items with quantities
        let totalAmount = 0;
        items.forEach((item: any) => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                totalAmount += Number(product.price) * (item.quantity || 1);
            }
        });

        if (totalAmount <= 0) {
            return NextResponse.json(
                { success: false, error: "Invalid order amount" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Create order in database (initially unpaid)
        const order = await prismadb.order.create({
            data: {
                storeId: storeId,
                phone: phone,
                address: address,
                isPaid: false,
                orderItems: {
                    create: items.map((item: any) => ({
                        productId: item.productId
                    }))
                }
            },
            include: {
                orderItems: true
            }
        });

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // Convert to paise
            currency: "INR",
            notes: {
                orderId: order.id,
                storeId: storeId,
            }
        });

        return NextResponse.json(
            {
                success: true,
                order: {
                    id: order.id, // Your database order ID
                    razorpayOrderId: razorpayOrder.id, // Razorpay order ID
                    amount: totalAmount,
                    amountInPaise: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                }
            },
            { headers: corsHeaders }
        );

    } catch (error) {
        console.error("[CHECKOUT_POST]", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error"
            },
            { status: 500, headers: corsHeaders }
        );
    }
}