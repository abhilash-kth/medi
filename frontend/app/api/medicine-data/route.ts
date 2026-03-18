import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  const skip = (page - 1) * limit;

  const medicines = await prisma.medicine.findMany({
    skip,
    take: limit,
    include: { products: true },
    orderBy: { id: "asc" },
  });

  const total = await prisma.medicine.count();

  return NextResponse.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: medicines,
  });
}
