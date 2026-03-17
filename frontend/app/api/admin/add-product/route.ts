import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1]

  if (!verifyToken(token || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const med = await prisma.medicine.findUnique({
    where: { id: body.medicineId }
  })

  if (!med) {
    return NextResponse.json({ error: "Medicine not found" }, { status: 404 })
  }

  const product = await prisma.product.upsert({
    where: {
      medicineId_source: {
        medicineId: body.medicineId,
        source: body.source
      }
    },
    create: body,
    update: {
      ...body,
      scrapedAt: new Date()
    }
  })

  return NextResponse.json({
    status: "PRODUCT_SAVED",
    product
  })
}
