import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ destinationId: string }> }
) {
  try {
    const { destinationId } = await params;
    if (!destinationId) {
      return new NextResponse("Destination id is required", { status: 400 });
    }

    const destination = await prismadb.destination.findUnique({
      where: {
        id: destinationId,
      },
    });

    return NextResponse.json(destination);
  } catch (err) {
    console.log("[DESTINATION_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; destinationId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, destinationId } = await params;

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!destinationId) {
      return new NextResponse("Destination id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const destination = await prismadb.destination.updateMany({
      where: {
        id: destinationId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(destination);
  } catch (err) {
    console.log("[DESTINATION_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; destinationId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, destinationId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!destinationId) {
      return new NextResponse("Destination id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const destination = await prismadb.destination.deleteMany({
      where: {
        id: destinationId,
      },
    });

    return NextResponse.json(destination);
  } catch (err) {
    console.log("[DESTINATION_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}


