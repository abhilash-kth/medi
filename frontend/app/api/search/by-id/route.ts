import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get("medicineId"))

  const med = await prisma.medicine.findUnique({
    where: { id },
    include: { products: true }
  })

  if (!med) {
    return NextResponse.json({
      status: "NOT_FOUND"
    })
  }

  return NextResponse.json({
    status: "FOUND",
    medicine: med,
    products: med.products
  })
}
