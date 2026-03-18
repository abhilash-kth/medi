// import { prisma } from '@/lib/prisma'
// import { NextResponse } from 'next/server'
// import { verifyToken } from '@/lib/auth'

// export async function DELETE(req: Request) {
//   const token = req.headers.get("authorization")?.split(" ")[1]

//   if (!verifyToken(token || "")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const { searchParams } = new URL(req.url)

//   const medicineId = Number(searchParams.get("medicineId"))
//   const source = searchParams.get("source")

//   await prisma.product.delete({
//     where: {
//       medicineId_source: {
//         medicineId,
//         source
//       }
//     }
//   })

//   return NextResponse.json({ status: "DELETED" })
// }

// app/api/.../route.ts  (DELETE handler)

// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth";
// import { Source } from "@prisma/client";

// export async function DELETE(req: Request) {
//   const token = req.headers.get("authorization")?.split(" ")?.[1] ?? null;

//   if (!token || !verifyToken(token)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { searchParams } = new URL(req.url);

//   const medicineIdStr = searchParams.get("medicineId");
//   const source = searchParams.get("source");

//   if (!medicineIdStr || !source) {
//     return NextResponse.json(
//       { error: "Missing required parameters: medicineId and source" },
//       { status: 400 },
//     );
//   }

//   const medicineId = Number(medicineIdStr);

//   if (isNaN(medicineId) || medicineId <= 0) {
//     return NextResponse.json(
//       { error: "Invalid medicineId (must be positive integer)" },
//       { status: 400 },
//     );
//   }

//   // Optional: validate source is a valid enum value
//   const validSources = ["NETMEDS", "PHARMEASY", "ONEMG", "TRUEMEDS"] as const;
//   if (!validSources.includes(source as any)) {
//     return NextResponse.json(
//       {
//         error:
//           "Invalid source. Must be one of: NETMEDS, PHARMEASY, ONEMG, TRUEMEDS",
//       },
//       { status: 400 },
//     );
//   }

//   try {
//     await prisma.product.delete({
//       where: {
//         medicineId_source: {
//           medicineId,
//           source: source as Source, // ← type assertion fixes the red underline
//         },
//       },
//     });

//     return NextResponse.json({ status: "DELETED" });
//   } catch (err: any) {
//     console.error("Delete product error:", err);

//     // Prisma error: record not found
//     if (err.code === "P2025") {
//       return NextResponse.json(
//         { error: "Product not found for the given medicineId and source" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { error: "Failed to delete product" },
//       { status: 500 },
//     );
//   }
// }

// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth";
// import { Source } from "@prisma/client";
// import { cookies } from "next/headers";

// export async function DELETE(req: Request) {
//   // ✅ FIX: await cookies()
//   const cookieStore = await cookies();

//   const token = cookieStore.get("auth_token")?.value;

//   const decoded = token ? verifyToken(token) : null;

//   if (!token || !decoded) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { searchParams } = new URL(req.url);

//   const medicineIdStr = searchParams.get("medicineId");
//   const source = searchParams.get("source");

//   if (!medicineIdStr || !source) {
//     return NextResponse.json(
//       { error: "Missing required parameters: medicineId and source" },
//       { status: 400 },
//     );
//   }

//   const medicineId = Number(medicineIdStr);

//   if (isNaN(medicineId) || medicineId <= 0) {
//     return NextResponse.json(
//       { error: "Invalid medicineId (must be positive integer)" },
//       { status: 400 },
//     );
//   }

//   const validSources = ["NETMEDS", "PHARMEASY", "ONEMG", "TRUEMEDS"] as const;

//   if (!validSources.includes(source as any)) {
//     return NextResponse.json(
//       {
//         error:
//           "Invalid source. Must be one of: NETMEDS, PHARMEASY, ONEMG, TRUEMEDS",
//       },
//       { status: 400 },
//     );
//   }

//   try {
//     await prisma.product.delete({
//       where: {
//         medicineId_source: {
//           medicineId,
//           source: source as Source,
//         },
//       },
//     });

//     return NextResponse.json({ status: "DELETED" });
//   } catch (err: any) {
//     console.error("Delete product error:", err);

//     if (err.code === "P2025") {
//       return NextResponse.json(
//         { error: "Product not found for the given medicineId and source" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { error: "Failed to delete product" },
//       { status: 500 },
//     );
//   }
// }

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { Source, Prisma } from "@prisma/client";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const decoded = token ? verifyToken(token) : null;

  if (!token || !decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const medicineIdStr = searchParams.get("medicineId");
  const source = searchParams.get("source");

  if (!medicineIdStr || !source) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const medicineId = Number(medicineIdStr);

  if (isNaN(medicineId) || medicineId <= 0) {
    return NextResponse.json({ error: "Invalid medicineId" }, { status: 400 });
  }

  const validSources = ["NETMEDS", "PHARMEASY", "ONEMG", "TRUEMEDS"] as const;
  type SourceType = (typeof validSources)[number];

  if (!validSources.includes(source as SourceType)) {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  const typedSource = source as Source;

  try {
    await prisma.product.delete({
      where: {
        medicineId_source: {
          medicineId,
          source: typedSource,
        },
      },
    });

    return NextResponse.json({ status: "DELETED" });
  } catch (err: unknown) {
    console.error("Delete product error:", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
