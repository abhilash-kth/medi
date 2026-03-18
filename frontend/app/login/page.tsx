// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/axios";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       setLoading(true);

//       const res = await api.post("/admin/login", { email, password });

//       // No localStorage.setItem anymore – cookie is set by server

//       router.push("/admin");
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         alert(error.response?.data?.message || "Invalid credentials");
//       } else {
//         alert("Something went wrong");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <Card className="w-[380px] shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl">Admin Login</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <Input
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <Input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <Button
//             className="w-full btn-primary"
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios"; // Your axios instance – make sure it has withCredentials: true
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Better UX: show errors in UI

  const router = useRouter();

  const handleLogin = async () => {
    setError(null); // Clear previous errors
    setLoading(true);

    try {
      // No need for 'const res =' since we don't use the response body
      await api.post("/admin/login", { email, password });

      // If server sets cookie successfully → redirect
      // (You can optionally check response.status === 200 or look for a success message in res.data)
      router.push("/admin");
      router.refresh(); // Optional: force refresh to update any server components
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && err.response) {
        // Type-safe Axios error handling
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || "Invalid credentials");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[380px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Admin Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              disabled={loading}
              autoFocus
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
            variant={loading ? "secondary" : "default"}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
