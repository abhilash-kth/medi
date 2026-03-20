// import { prisma } from '@/lib/prisma'
// import { NextResponse } from 'next/server'
// import { verifyToken } from '@/lib/auth'

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const token = req.headers.get("authorization")?.split(" ")[1]

//   if (!verifyToken(token || "")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const productId = Number(params.id)
//   const body = await req.json()

//   const product = await prisma.product.findUnique({
//     where: { id: productId }
//   })

//   if (!product) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 })
//   }

//   const updated = await prisma.product.update({
//     where: { id: productId },
//     data: body
//   })

//   return NextResponse.json({
//     status: "UPDATED",
//     product: updated
//   })
// }

// app/api/admin/product/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

function isPrismaKnownRequestError(
  err: unknown,
): err is { code: string; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string"
  );
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  // ✅ FIX: use cookies instead of headers
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const decoded = token ? verifyToken(token) : null;

  if (!token || !decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ params fix (already correct)
  const params = await context.params;
  const productId = Number(params.id);

  if (isNaN(productId) || productId <= 0) {
    return NextResponse.json(
      { error: "Invalid product ID (must be a positive integer)" },
      { status: 400 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: body,
    });

    return NextResponse.json({
      status: "UPDATED",
      product: updated,
    });
  } catch (err: unknown) {
    console.error("Product update error:", err);

    if (isPrismaKnownRequestError(err) && err.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "Failed to update product",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
