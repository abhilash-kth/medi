import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!verifyToken(token || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const med = await prisma.medicine.upsert({
    where: { canonicalName: body.canonicalName },
    create: {
      ...body,
      approved: true,
      approvedAt: new Date(),
    },
    update: {
      approved: true,
      approvedAt: new Date()
    }
  })

  await prisma.searchRequest.updateMany({
    where: { canonicalName: body.canonicalName },
    data: { status: "APPROVED" }
  })

  return NextResponse.json(med)
}
