import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            orderId, // Your database order ID
        } = await request.json();

        // Validation
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, error: "Missing payment details" },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: "Order ID is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            console.error("RAZORPAY_KEY_SECRET is not set");
            return NextResponse.json(
                { success: false, error: "Server configuration error" },
                { status: 500, headers: corsHeaders }
            );
        }

        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        console.log("Generated signature:", generated_signature);
        console.log("Received signature:", razorpay_signature);

        if (generated_signature !== razorpay_signature) {
            console.error("Signature verification failed");
            return NextResponse.json(
                { success: false, error: "Invalid payment signature" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Update order to paid status
        const updatedOrder = await prismadb.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Payment verified successfully",
                order: updatedOrder,
            },
            { headers: corsHeaders }
        );
    } catch (error) {
        console.error("Verify payment error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Failed to verify payment"
            },
            { status: 500, headers: corsHeaders }
        );
    }
}