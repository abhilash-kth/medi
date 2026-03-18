// import { prisma } from '@/lib/prisma'
// import { NextResponse } from 'next/server'
// import { verifyToken } from '@/lib/auth'

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const token = req.headers.get("authorization")?.split(" ")[1]

//   if (!verifyToken(token || "")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const id = Number(params.id)

//   const request = await prisma.searchRequest.findUnique({
//     where: { id }
//   })

//   if (!request) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 })
//   }

//   await prisma.searchRequest.delete({
//     where: { id }
//   })

//   return NextResponse.json({ status: "DELETED" })
// }

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // ✅ FIX: await params
    const { id } = await params;
    const requestId = Number(id);

    // ✅ Auth
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!verifyToken(token || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Check if request exists
    const request = await prisma.searchRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // ✅ Delete request
    await prisma.searchRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ status: "DELETED" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
