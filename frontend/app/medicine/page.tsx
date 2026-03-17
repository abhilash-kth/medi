import { AdminLayout } from "@/components/layout/admin-layout"
import Medicine from "@/components/medicineTable/medicine"


export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* <h2 className="text-2xl font-bold">All Medicine</h2> */}
        <Medicine />
      </div>
    </AdminLayout> 
  )
}