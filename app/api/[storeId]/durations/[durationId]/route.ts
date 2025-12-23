import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ durationId: string }> }
) {
  try {
    const { durationId } = await params;
    if (!durationId) {
      return new NextResponse("Duration id is required", { status: 400 });
    }

    const duration = await prismadb.duration.findUnique({
      where: {
        id: durationId,
      },
    });

    return NextResponse.json(duration);
  } catch (err) {
    console.log("[DURATION_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; durationId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, durationId } = await params;

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

    if (!durationId) {
      return new NextResponse("Duration id is required", { status: 400 });
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

    const duration = await prismadb.duration.updateMany({
      where: {
        id: durationId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(duration);
  } catch (err) {
    console.log("[DURATION_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; durationId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, durationId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!durationId) {
      return new NextResponse("Duration id is required", { status: 400 });
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

    const duration = await prismadb.duration.deleteMany({
      where: {
        id: durationId,
      },
    });

    return NextResponse.json(duration);
  } catch (err) {
    console.log("[DURATION_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}


