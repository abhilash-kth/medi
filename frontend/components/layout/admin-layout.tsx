import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-3">{children}</main>
      </div>
    </div>
  )
}
