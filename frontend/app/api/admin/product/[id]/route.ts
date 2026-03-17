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

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }  // ← note: Promise<{ id: string }>
) {
  const token = req.headers.get("authorization")?.split(" ")?.[1] ?? null

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Await the params Promise – this is the required fix
  const params = await context.params
  const productId = Number(params.id)

  if (isNaN(productId) || productId <= 0) {
    return NextResponse.json(
      { error: "Invalid product ID (must be a positive integer)" },
      { status: 400 }
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  try {
    // Optional: check if exists first (good practice)
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true } // minimal
    })

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update – be careful with what you allow in body!
    // In production, validate/sanitize body or use zod/prisma validator
    const updated = await prisma.product.update({
      where: { id: productId },
      data: body
    })

    return NextResponse.json({
      status: "UPDATED",
      product: updated
    })
  } catch (err: any) {
    console.error("Product update error:", err)

    if (err.code === 'P2025') { // Prisma "not found"
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Failed to update product", detail: err.message },
      { status: 500 }
    )
  }
}