import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
export default function HomePage() {

   redirect("/admin")
  
  
}
