// "use client";

// import { useEffect, useState } from "react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// import { AddMedicineDialog } from "./add-medicine-dialog";
// import { fetchSearchRequests } from "./searchRequestData";

// interface Request {
//   id: number;
//   canonicalName: string;
//   brand: string;
//   strength: string;
//   form: string;
//   variant: string;
//   operatorName: string; // ✅ added
// }

// export function SearchRequestTable() {
//   const [data, setData] = useState<Request[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   const loadRequests = async () => {
//     const res = await fetchSearchRequests();
//     setData(res.data);
//     setLoading(false);
//   };

//   if (loading) {
//     return <div className="p-6 text-muted-foreground">Loading requests...</div>;
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Search Requests</CardTitle>
//       </CardHeader>

//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Query</TableHead>
//               <TableHead>Brand</TableHead>
//               <TableHead>Strength</TableHead>
//               <TableHead>Form</TableHead>
//               <TableHead>Variant</TableHead>
//               <TableHead>Operator</TableHead>
//               <TableHead className="text-right">Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {data.length === 0 && (
//               <TableRow>
//                 <TableCell
//                   colSpan={7}
//                   className="text-center py-8 text-muted-foreground"
//                 >
//                   No pending requests
//                 </TableCell>
//               </TableRow>
//             )}

//             {data.map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>{row.canonicalName}</TableCell>

//                 <TableCell>{row.brand}</TableCell>

//                 <TableCell>{row.strength}</TableCell>

//                 <TableCell>{row.form}</TableCell>

//                 <TableCell className="uppercase">
//                   <Badge variant="secondary">{row.variant}</Badge>
//                 </TableCell>

//                 {/* ✅ Operator name */}
//                 <TableCell>{row.operatorName || "—"}</TableCell>

//                 <TableCell className="text-right">
//                   <AddMedicineDialog request={row} />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// import { AddMedicineDialog } from "./add-medicine-dialog";
// import { fetchSearchRequests } from "./searchRequestData";

// interface Request {
//   id: number;
//   canonicalName: string;
//   brand: string;
//   strength: string;
//   form: string;
//   variant: string;
//   operatorName: string;
// }

// export function SearchRequestTable() {
//   const [data, setData] = useState<Request[]>([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Move function above useEffect
//   const loadRequests = async (): Promise<void> => {
//     try {
//       const res = await fetchSearchRequests();
//       setData(res.data);
//     } catch (error) {
//       console.error("Failed to load requests", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   if (loading) {
//     return <div className="p-6 text-muted-foreground">Loading requests...</div>;
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Search Requests</CardTitle>
//       </CardHeader>

//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Query</TableHead>
//               <TableHead>Brand</TableHead>
//               <TableHead>Strength</TableHead>
//               <TableHead>Form</TableHead>
//               <TableHead>Variant</TableHead>
//               <TableHead>Operator</TableHead>
//               <TableHead className="text-right">Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {data.length === 0 && (
//               <TableRow>
//                 <TableCell
//                   colSpan={7}
//                   className="text-center py-8 text-muted-foreground"
//                 >
//                   No pending requests
//                 </TableCell>
//               </TableRow>
//             )}

//             {data.map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>{row.canonicalName}</TableCell>
//                 <TableCell>{row.brand}</TableCell>
//                 <TableCell>{row.strength}</TableCell>
//                 <TableCell>{row.form}</TableCell>

//                 <TableCell className="uppercase">
//                   <Badge variant="secondary">{row.variant}</Badge>
//                 </TableCell>

//                 <TableCell>{row.operatorName || "—"}</TableCell>

//                 <TableCell className="text-right">
//                   <AddMedicineDialog request={row} />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { AddMedicineDialog } from "./add-medicine-dialog";
import {
  fetchSearchRequests,
  deleteSearchRequest,
} from "./searchRequestData";
import { useRouter } from "next/navigation";
interface Request {
  id: number;
  canonicalName: string;
  brand: string;
  strength: string;
  form: string;
  variant: string;
  operatorName: string;
}

export function SearchRequestTable() {
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const loadRequests = async () => {
    try {
      const res = await fetchSearchRequests();
      setData(res.data);
    } catch (error) { 
      console.error(error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [data]);

  // ✅ Toggle checkbox
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteSearchRequest(id)));

      toast.success("Deleted successfully ✅");

      setSelectedIds([]);
      setConfirmOpen(false);

      await loadRequests(); // refresh
    } catch (error) {
      console.error(error);
      toast.error("Delete failed ❌");
    }
  };

  // ✅ After medicine created callback
  const handleMedicineAdded =  () => {
    toast.success("Medicine added successfully 💊");
    router.refresh();
    loadRequests();
  };

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading requests...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Search Requests</CardTitle>

        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Delete ({selectedIds.length})
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Query</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Form</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No pending requests
                </TableCell>
              </TableRow>
            )}

            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => toggleSelect(row.id)}
                  />
                </TableCell>

                <TableCell>{row.canonicalName}</TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>{row.strength}</TableCell>
                <TableCell>{row.form}</TableCell>

                <TableCell className="uppercase">
                  <Badge variant="secondary">{row.variant}</Badge>
                </TableCell>

                <TableCell>{row.operatorName || "—"}</TableCell>

                <TableCell className="text-right">
                  <AddMedicineDialog
                    request={row}
                    onSuccess={handleMedicineAdded} // ✅ trigger toast
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
       <Toaster richColors position="top-right" />
      {/* ✅ Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[350px]">
            <h2 className="text-lg font-semibold mb-2">
              Confirm Deletion
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete selected requests?
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </Card>
  );
}

