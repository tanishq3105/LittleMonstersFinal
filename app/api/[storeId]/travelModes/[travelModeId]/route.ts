import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ travelModeId: string }> }
) {
  try {
    const { travelModeId } = await params;
    if (!travelModeId) {
      return new NextResponse("Travel mode id is required", { status: 400 });
    }

    const travelMode = await prismadb.size.findUnique({
      where: {
        id: travelModeId,
      },
    });

    return NextResponse.json(travelMode);
  } catch (err) {
    console.log("[TRAVEL_MODE_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; travelModeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, travelModeId } = await params;

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

    if (!travelModeId) {
      return new NextResponse("Travel mode id is required", { status: 400 });
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

    const travelMode = await prismadb.size.updateMany({
      where: {
        id: travelModeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(travelMode);
  } catch (err) {
    console.log("[TRAVEL_MODE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; travelModeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, travelModeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!travelModeId) {
      return new NextResponse("Travel mode id is required", { status: 400 });
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

    const travelMode = await prismadb.size.deleteMany({
      where: {
        id: travelModeId,
      },
    });

    return NextResponse.json(travelMode);
  } catch (err) {
    console.log("[TRAVEL_MODE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}


