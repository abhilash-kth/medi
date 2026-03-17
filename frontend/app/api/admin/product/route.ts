// import { prisma } from '@/lib/prisma'
// import { NextResponse } from 'next/server'
// import { verifyToken } from '@/lib/auth'

// export async function DELETE(req: Request) {
//   const token = req.headers.get("authorization")?.split(" ")[1]

//   if (!verifyToken(token || "")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const { searchParams } = new URL(req.url)

//   const medicineId = Number(searchParams.get("medicineId"))
//   const source = searchParams.get("source")

//   await prisma.product.delete({
//     where: {
//       medicineId_source: {
//         medicineId,
//         source
//       }
//     }
//   })

//   return NextResponse.json({ status: "DELETED" })
// }

// app/api/.../route.ts  (DELETE handler)

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { Source } from '@prisma/client';

export async function DELETE(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")?.[1] ?? null

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)

  const medicineIdStr = searchParams.get("medicineId")
  const source       = searchParams.get("source")

  if (!medicineIdStr || !source) {
    return NextResponse.json(
      { error: "Missing required parameters: medicineId and source" },
      { status: 400 }
    )
  }

  const medicineId = Number(medicineIdStr)

  if (isNaN(medicineId) || medicineId <= 0) {
    return NextResponse.json(
      { error: "Invalid medicineId (must be positive integer)" },
      { status: 400 }
    )
  }

  // Optional: validate source is a valid enum value
  const validSources = ["NETMEDS", "PHARMEASY", "ONEMG", "TRUEMEDS"] as const
  if (!validSources.includes(source as any)) {
    return NextResponse.json(
      { error: "Invalid source. Must be one of: NETMEDS, PHARMEASY, ONEMG, TRUEMEDS" },
      { status: 400 }
    )
  }

  try {
    await prisma.product.delete({
      where: {
        medicineId_source: {
          medicineId,
          source: source as Source  // ← type assertion fixes the red underline
        }
      }
    })

    return NextResponse.json({ status: "DELETED" })
  } catch (err: any) {
    console.error("Delete product error:", err)

    // Prisma error: record not found
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: "Product not found for the given medicineId and source" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}