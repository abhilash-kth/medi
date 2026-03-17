import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border glass p-6">
      <h2 className="text-xl font-bold mb-6">Med Admin</h2>

      <nav className="space-y-3">
        <Link
          href="/admin"
          className="block rounded-lg px-4 py-2 hover:bg-muted"
        >
          Search Requests
        </Link>
        <Link
          href="/medicine"
          className="block rounded-lg px-4 py-2 hover:bg-muted"
        >
         All Medicine
        </Link>
      </nav>
    </aside>
  )
}
