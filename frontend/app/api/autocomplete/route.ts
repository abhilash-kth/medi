import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").toUpperCase()

  if (q.length < 2) return NextResponse.json([])

  const medicines = await prisma.medicine.findMany({
    where: {
      OR: [
        { brand: { startsWith: q } },
        { canonicalName: { contains: q } }
      ]
    },
    take: 8
  })

  return NextResponse.json(medicines)
}
