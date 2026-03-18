import { AdminLayout } from "@/components/layout/admin-layout";
import { SearchRequestTable } from "@/components/search/search-request-table";

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Search Requests</h2>
        <SearchRequestTable />
      </div>
    </AdminLayout>
  );
}
