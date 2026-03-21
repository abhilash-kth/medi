import { AdminLayout } from "@/components/layout/admin-layout";
import { SearchRequestTable } from "@/components/search/search-request-table";

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-[#1f4f9a]">Search Requests</h2>
        <SearchRequestTable />
      </div>
    </AdminLayout>
  );
}
