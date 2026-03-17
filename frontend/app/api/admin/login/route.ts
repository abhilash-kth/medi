// import { prisma } from "@/lib/prisma"
// import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"

// const SECRET = process.env.JWT_SECRET_KEY!

// export async function POST(req: Request) {
//   const { email, password } = await req.json()

//   const admin = await prisma.user.findUnique({
//     where: { email }
//   })

//   if (!admin) {
//     return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
//   }

//   const isValid = await bcrypt.compare(password, admin.password)

//   if (!isValid) {
//     return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
//   }

//   const token = jwt.sign({ id: admin.id }, SECRET, { expiresIn: "1d" })

//   return NextResponse.json({ token })
// }
// app/api/admin/login/route.ts
// app/api/admin/login/route.ts  (or wherever your login endpoint lives)
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 2. Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 3. Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    // 4. Set httpOnly cookie (recommended & more secure)
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    })

    // Alternative (if you want to keep localStorage way):
    // return NextResponse.json({ token, success: true })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}