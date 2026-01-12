import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ storeId: string; refundId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        const { storeId, refundId } = await params;
        const body = await req.json();
        const { status, adminNote } = body;

        if (!storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!refundId) {
            return new NextResponse('Refund ID is required', { status: 400 });
        }

        // Verify user owns the store
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (adminNote !== undefined) updateData.adminNote = adminNote;

        const refundRequest = await prismadb.refundRequest.update({
            where: {
                id: refundId,
            },
            data: updateData,
        });

        return NextResponse.json(refundRequest);
    } catch (error) {
        console.error('[REFUND_PATCH]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ storeId: string; refundId: string }> }
) {
    try {
        const { storeId, refundId } = await params;

        if (!storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!refundId) {
            return new NextResponse('Refund ID is required', { status: 400 });
        }

        const refundRequest = await prismadb.refundRequest.findFirst({
            where: {
                id: refundId,
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
        });

        if (!refundRequest) {
            return new NextResponse('Refund request not found', { status: 404 });
        }

        return NextResponse.json(refundRequest);
    } catch (error) {
        console.error('[REFUND_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
