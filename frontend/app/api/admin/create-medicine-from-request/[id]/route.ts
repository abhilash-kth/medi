// import { prisma } from '@/lib/prisma'
// import { NextResponse } from 'next/server'
// import { verifyToken } from '@/lib/auth'

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const token = req.headers.get("authorization")?.split(" ")[1]
//   if (!verifyToken(token || "")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const requestId = Number(params.id)

//   const reqData = await prisma.searchRequest.findUnique({
//     where: { id: requestId }
//   })

//   if (!reqData) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 })
//   }

//   const exists = await prisma.medicine.findFirst({
//     where: {
//       brand: reqData.brand,
//       strength: reqData.strength,
//       form: reqData.form,
//       variant: reqData.variant
//     }
//   })

//   if (exists) {
//     return NextResponse.json({
//       status: "MEDICINE_ALREADY_EXISTS",
//       medicineId: exists.id
//     })
//   }

//   const med = await prisma.medicine.create({
//     data: {
//       brand: reqData.brand,
//       strength: reqData.strength,
//       form: reqData.form,
//       variant: reqData.variant,
//       canonicalName: reqData.canonicalName,
//       approved: true
//     }
//   })

//   await prisma.searchRequest.delete({
//     where: { id: requestId }
//   })

//   return NextResponse.json({
//     status: "MEDICINE_CREATED",
//     medicineId: med.id
//   })
// }

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // ✅ Await params (IMPORTANT FIX)
    const { id } = await params;
    const requestId = Number(id);

    // ✅ Auth
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!verifyToken(token || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch request
    const reqData = await prisma.searchRequest.findUnique({
      where: { id: requestId },
    });

    if (!reqData) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // ✅ Check if medicine exists
    const exists = await prisma.medicine.findFirst({
      where: {
        brand: reqData.brand,
        strength: reqData.strength,
        form: reqData.form,
        variant: reqData.variant,
      },
    });

    if (exists) {
      return NextResponse.json({
        status: "MEDICINE_ALREADY_EXISTS",
        medicineId: exists.id,
      });
    }

    // ✅ Create medicine
    const med = await prisma.medicine.create({
      data: {
        brand: reqData.brand,
        strength: reqData.strength,
        form: reqData.form,
        variant: reqData.variant,
        canonicalName: reqData.canonicalName,
        approved: true,
      },
    });

    // ✅ Delete request after processing
    await prisma.searchRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json({
      status: "MEDICINE_CREATED",
      medicineId: med.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
