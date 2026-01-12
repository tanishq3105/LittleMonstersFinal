import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;

        if (!storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const refundRequests = await prismadb.refundRequest.findMany({
            where: {
                order: {
                    storeId: storeId,
                },
            },
            include: {
                order: {
                    include: {
                        orderItems: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(refundRequests);
    } catch (error) {
        console.error('[REFUNDS_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;
        const body = await req.json();
        const { orderId, reason } = body;

        if (!storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!orderId) {
            return new NextResponse('Order ID is required', { status: 400 });
        }

        if (!reason) {
            return new NextResponse('Reason is required', { status: 400 });
        }

        // Verify the order exists and belongs to this store
        const order = await prismadb.order.findFirst({
            where: {
                id: orderId,
                storeId: storeId,
            },
        });

        if (!order) {
            return new NextResponse('Order not found', { status: 404 });
        }

        // Check if a refund request already exists for this order
        const existingRefund = await prismadb.refundRequest.findFirst({
            where: {
                orderId: orderId,
            },
        });

        if (existingRefund) {
            return new NextResponse('A refund request already exists for this order', { status: 400 });
        }

        const refundRequest = await prismadb.refundRequest.create({
            data: {
                orderId,
                reason,
            },
        });

        return NextResponse.json(refundRequest);
    } catch (error) {
        console.error('[REFUNDS_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
