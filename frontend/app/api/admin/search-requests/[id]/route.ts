import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("authorization")?.split(" ")[1]

  if (!verifyToken(token || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number(params.id)

  const request = await prisma.searchRequest.findUnique({
    where: { id }
  })

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.searchRequest.delete({
    where: { id }
  })

  return NextResponse.json({ status: "DELETED" })
}
