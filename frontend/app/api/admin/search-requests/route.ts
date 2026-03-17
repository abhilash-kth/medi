import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const requests = await prisma.searchRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      status: "SUCCESS",
      data: requests,
    })
  } catch (error) {
    console.error("Fetch search requests error:", error)

    return NextResponse.json(
      { message: "Failed to fetch search requests" },
      { status: 500 }
    )
  }
}
