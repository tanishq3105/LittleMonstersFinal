import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server'
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            durationId,
            ageId,
            destinationId,
            images,
            isFeatured,
            isArchived
        } = body; 

        const { storeId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!price) new NextResponse("Price is required", { status: 400});

        if (!categoryId) new NextResponse("Category id is required", { status: 400});

        if (!colorId) new NextResponse("Color id is required", { status: 400});

        if (!sizeId) new NextResponse("Size id is required", { status: 400});

        if (!durationId) new NextResponse("Duration id is required", { status: 400});

        if (!ageId) new NextResponse("Age id is required", { status: 400});

        if (!destinationId) new NextResponse("Destination id is required", { status: 400});

        if (!isFeatured) new NextResponse("Featured is required", { status: 400});

        if (!isArchived) new NextResponse("Archived is required", { status: 400});

        // if (!images || !images.length) {
        //     return new NextResponse("Image is required", { status: 400});
        // }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await prismadb.product.create({
            data : {
                name,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url:string }) => image)
                        ]
                    }
                },
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                colorId,
                storeId: storeId,
                durationId,
                ageId,
                destinationId
            }
        })

        return NextResponse.json(product);

    } catch (err) {
        console.log(`[PRODUCTS_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params; 
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const durationId = searchParams.get('durationId') || undefined;
        const ageId = searchParams.get('ageId') || undefined;
        const destinationId = searchParams.get('destinationId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: storeId,
                categoryId,
                colorId,
                sizeId,
                durationId,
                ageId,
                destinationId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
                duration: true,
                age: true,
                destination: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(products);

    } catch (err) {
        console.log(`[PRODUCTS_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}