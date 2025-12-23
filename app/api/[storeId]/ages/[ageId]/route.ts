import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ageId: string }> }
) {
  try {
    const { ageId } = await params;
    if (!ageId) {
      return new NextResponse("Age id is required", { status: 400 });
    }

    const age = await prismadb.age.findUnique({
      where: {
        id: ageId,
      },
    });

    return NextResponse.json(age);
  } catch (err) {
    console.log("[AGE_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; ageId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, ageId } = await params;

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

    if (!ageId) {
      return new NextResponse("Age id is required", { status: 400 });
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

    const age = await prismadb.age.updateMany({
      where: {
        id: ageId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(age);
  } catch (err) {
    console.log("[AGE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; ageId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, ageId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!ageId) {
      return new NextResponse("Age id is required", { status: 400 });
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

    const age = await prismadb.age.deleteMany({
      where: {
        id: ageId,
      },
    });

    return NextResponse.json(age);
  } catch (err) {
    console.log("[AGE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

