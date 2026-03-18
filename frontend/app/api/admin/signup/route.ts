// // app/api/admin/signup/route.ts

// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     // Check if ANY user already exists (this prevents creating a second admin)
//     const existingUser = await prisma.user.findFirst({
//       select: { id: true }, // minimal selection - we only care if something exists
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         {
//           error:
//             "An admin account already exists. This endpoint can only be used once.",
//         },
//         { status: 403 },
//       );
//     }

//     const body = await req.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 },
//       );
//     }

//     // Basic input validation
//     if (typeof email !== "string" || !email.includes("@")) {
//       return NextResponse.json(
//         { error: "Valid email is required" },
//         { status: 400 },
//       );
//     }

//     if (typeof password !== "string" || password.length < 8) {
//       return NextResponse.json(
//         { error: "Password must be at least 8 characters long" },
//         { status: 400 },
//       );
//     }

//     // Hash password (12 rounds is a good balance in 2025/2026)
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create the first (and only) admin
//     const user = await prisma.user.create({
//       data: {
//         email: email.trim().toLowerCase(),
//         password: hashedPassword,
//         // role defaults to ADMIN automatically per your schema
//       },
//       select: {
//         id: true,
//         email: true,
//         role: true,
//         createdAt: true,
//       },
//     });

//     return NextResponse.json(
//       {
//         message:
//           "First admin account created successfully. This endpoint is now permanently locked.",
//         user,
//       },
//       { status: 201 },
//     );
//   } catch (error: any) {
//     console.error("Admin signup error:", error);

//     // Prisma unique constraint error (email already exists)
//     if (error.code === "P2002") {
//       return NextResponse.json(
//         { error: "This email is already taken" },
//         { status: 409 },
//       );
//     }

//     return NextResponse.json(
//       { error: "Failed to create admin account" },
//       { status: 500 },
//     );
//   }
// }

// app/api/admin/signup/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Basic input validation
    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Hash password (12 rounds is a good balance in 2025/2026)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin account
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: "ADMIN", // Explicitly set role
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Admin account created successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Admin signup error:", error);

    // Prisma unique constraint error (email already exists)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This email is already taken" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create admin account" },
      { status: 500 },
    );
  }
}
