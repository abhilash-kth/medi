import Footer from "./footer"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen h-[870px] bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-3 bg-[#9fd6ce]">{children}</main>
        <div className="absolute">
        <Footer/>
      </div>
      </div>
    </div>
  )
}
