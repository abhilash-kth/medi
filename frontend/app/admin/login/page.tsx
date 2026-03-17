"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await api.post("/admin/login", { email, password });

    // No localStorage.setItem anymore – cookie is set by server

    router.push("/admin");
  } catch (error: any) {
    alert(error?.response?.data?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[380px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Admin Login
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
