import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ storeId: string; orderId: string }> }
) {
    try {
        const { storeId, orderId } = await params;
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return new NextResponse('Status is required', { status: 400 });
        }

        const order = await prismadb.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: status,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('[ORDER_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
