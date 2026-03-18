import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const decoded = token ? verifyToken(token) : null;

  if (!token || !decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Safe JSON parsing
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ✅ Validation
  if (!body.medicineId || !body.source) {
    return NextResponse.json(
      { error: "medicineId and source are required" },
      { status: 400 },
    );
  }

  const validSources = ["NETMEDS", "PHARMEASY", "ONEMG", "TRUEMEDS"];
  if (!validSources.includes(body.source)) {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  // ✅ Check medicine exists
  const med = await prisma.medicine.findUnique({
    where: { id: body.medicineId },
  });

  if (!med) {
    return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
  }

  // ✅ Upsert product
  const product = await prisma.product.upsert({
    where: {
      medicineId_source: {
        medicineId: body.medicineId,
        source: body.source,
      },
    },
    create: body,
    update: {
      ...body,
      scrapedAt: new Date(),
    },
  });

  return NextResponse.json({
    status: "PRODUCT_SAVED",
    product,
  });
}

// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth";
// import { cookies } from "next/headers";

// export async function POST(req: Request) {
//   // ✅ FIX: use cookies instead of headers
//   const cookieStore = await cookies();
//   const token = cookieStore.get("auth_token")?.value;

//   const decoded = token ? verifyToken(token) : null;

//   if (!token || !decoded) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const body = await req.json();

//   const med = await prisma.medicine.findUnique({
//     where: { id: body.medicineId },
//   });

//   if (!med) {
//     return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
//   }

//   const product = await prisma.product.upsert({
//     where: {
//       medicineId_source: {
//         medicineId: body.medicineId,
//         source: body.source,
//       },
//     },
//     create: body,
//     update: {
//       ...body,
//       scrapedAt: new Date(),
//     },
//   });

//   return NextResponse.json({
//     status: "PRODUCT_SAVED",
//     product,
//   });
// }
