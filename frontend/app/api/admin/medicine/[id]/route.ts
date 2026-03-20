import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ FIXED TYPE
) {
  try {
    // ✅ unwrap params (REQUIRED in Next.js 16)
    const { id } = await params;

    // ✅ get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const decoded = token ? verifyToken(token) : null;

    if (!token || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ validate id
    const medicineId = Number(id);

    if (isNaN(medicineId) || medicineId <= 0) {
      return NextResponse.json(
        { error: "Invalid medicine ID" },
        { status: 400 }
      );
    }

    // ✅ check existence
    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId },
    });

    if (!medicine) {
      return NextResponse.json(
        { error: "Medicine not found" },
        { status: 404 }
      );
    }

    // ✅ delete related products
    await prisma.product.deleteMany({
      where: { medicineId },
    });

    // ✅ delete medicine
    await prisma.medicine.delete({
      where: { id: medicineId },
    });

    return NextResponse.json({
      status: "MEDICINE_DELETED",
      message: "Medicine and related products deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete medicine error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete medicine",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
