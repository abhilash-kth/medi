// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);

//   const page = Number(searchParams.get("page") || 1);
//   const limit = Number(searchParams.get("limit") || 20);

//   const skip = (page - 1) * limit;

//   const medicines = await prisma.medicine.findMany({
//     skip,
//     take: limit,
//     include: { products: true },
//     orderBy: { id: "asc" },
//   });

//   const total = await prisma.medicine.count();

//   return NextResponse.json({
//     page,
//     limit,
//     total,
//     totalPages: Math.ceil(total / limit),
//     data: medicines,
//   });
// }

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams)

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  // ✅ NEW: filter param
  const approvedFilter = searchParams.get("approvedFilter"); // "true" | "false" | null

  const skip = (page - 1) * limit;

  const whereCondition =
    approvedFilter === "APPROVED"
      ? { approved: true }
      : approvedFilter === "NOT_APPROVED"
        ? { approved: false }
        : {};

  const medicines = await prisma.medicine.findMany({
    skip,
    take: limit,
    where: whereCondition,

    // 🔥 IMPORTANT: Replace old sorting
    // orderBy: [
    //   { approvedAt: "desc" }, // recently approved first
    //   { createdAt: "desc" },  // newest medicines fallback
    // ],

    include: { products: true },
    orderBy:
      approvedFilter === "ALL"
        ? [{ createdAt: "desc" }] // latest first
        : [{ createdAt: "desc" }],
  });

  const total = await prisma.medicine.count({
    where: whereCondition,
  });

  return NextResponse.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: medicines,
  });
}
