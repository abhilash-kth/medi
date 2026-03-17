import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET_KEY as string

export function generateToken(user: any) {
  return jwt.sign(user, SECRET, { expiresIn: "1d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

