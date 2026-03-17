import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { parseMedicine } from '@/lib/parser'

export async function POST(req: Request) {
  const body = await req.json()

  const parts = parseMedicine(body.name)

  try {
    const request = await prisma.searchRequest.create({
      data: {
        ...parts,
        operatorName: body.operatorName
      }
    })

    return NextResponse.json({
      status: "REQUEST_CREATED",
      data: request
    })
  } catch {
    const exists = await prisma.searchRequest.findFirst({
      where: {
        brand: parts.brand,
        strength: parts.strength,
        form: parts.form,
        variant: parts.variant
      }
    })

    return NextResponse.json({
      status: "ALREADY_REQUESTED",
      data: exists
    })
  }
}
