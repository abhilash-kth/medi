// "use client"

// import { useEffect, useState } from "react"
// import { fetchMedicines, searchMedicines, searchById } from "./medicineData"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Card } from "@/components/ui/card"

// import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react"

// interface Product {
//   id: number
//   source: string
//   name: string
//   pack: string
//   price: string
//   originalPrice: string
//   discount: string
//   productUrl: string
// }

// interface Medicine {
//   id: number
//   brand: string
//   strength: string
//   form: string
//   variant: string
//   canonicalName: string
//   approved: boolean
//   products: Product[]
// }

// export default function Medicine() {
//   const [data, setData] = useState<Medicine[]>([])
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [search, setSearch] = useState("")
//   const [suggestions, setSuggestions] = useState<any[]>([])
//   const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
//   const [dialogOpen, setDialogOpen] = useState(false)

//   useEffect(() => {
//     if (search.trim() === "") {
//       loadMedicines(page)
//     }
//   }, [page])

//   const loadMedicines = async (pageNumber: number) => {
//     const res = await fetchMedicines(pageNumber, 10)
//     setData(res.data)
//     setTotalPages(res.totalPages)
//   }

//   // ---------------- SEARCH ----------------
//   const handleSearch = async (value: string) => {
//     setSearch(value)

//     if (value.trim() === "") {
//       setSuggestions([])
//       // Reset to current page pagination when user manually clears input
//       loadMedicines(page)
//       return
//     }

//     if (value.length < 2) {
//       setSuggestions([])
//       return
//     }

//     const res = await searchMedicines(value)
//     setSuggestions(res)
//   }

//   const handleSelect = async (id: number) => {
//     const res = await searchById(id)
//     if (res.status === "FOUND") {
//       setData([{ ...res.medicine, products: res.products }])
//       setSuggestions([])
//       setSearch("") // keep input clean
//       setTotalPages(1)
//       setPage(1)
//     }
//   }

//   // ---------------- CSV EXPORT ----------------
//   const exportCSV = async () => {
//     let allData: Medicine[] = []
//     let currentPage = 1
//     let more = true

//     while (more) {
//       const res = await fetchMedicines(currentPage, 50)
//       allData = [...allData, ...res.data]
//       if (currentPage >= res.totalPages) {
//         more = false
//       } else {
//         currentPage++
//       }
//     }

//     const rows: string[] = []
//     rows.push(
//       "MedicineId,Brand,Strength,Form,Variant,CanonicalName,Source,ProductName,Pack,Price,OriginalPrice,Discount,ProductURL"
//     )

//     allData.forEach((med) => {
//       med.products.forEach((prod) => {
//         rows.push(
//           `${med.id},"${med.brand}","${med.strength}","${med.form}","${med.variant}","${med.canonicalName}","${prod.source}","${prod.name.replace(/"/g, '""')}","${prod.pack}","${prod.price}","${prod.originalPrice}","${prod.discount}","${prod.productUrl}"`
//         )
//       })
//     })

//     const blob = new Blob([rows.join("\n")], {
//       type: "text/csv;charset=utf-8;",
//     })
//     const link = document.createElement("a")
//     link.href = URL.createObjectURL(blob)
//     link.download = `all_medicines_${new Date().toISOString().slice(0, 10)}.csv`
//     link.click()
//   }

//   // ---------------- SMART PAGINATION (max 9 page buttons, sliding window) ----------------
//   const generatePages = () => {
//     const MAX_VISIBLE = 9
//     let start = Math.max(1, page - Math.floor(MAX_VISIBLE / 2))
//     let end = Math.min(totalPages, start + MAX_VISIBLE - 1)

//     if (end - start + 1 < MAX_VISIBLE) {
//       start = Math.max(1, end - MAX_VISIBLE + 1)
//     }

//     const pages: number[] = []
//     for (let i = start; i <= end; i++) {
//       pages.push(i)
//     }
//     return pages
//   }

//   return (
//     // <div className="min-h-screen bg-background p-6 md:p-10 border">
//       <div className="max-w-10xl mx-auto space-y-8">
//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
//           <div>
//             <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
//               Medicine Catalog
//             </h1>
//             <p className="mt-2 text-lg text-muted-foreground">
//               Real-time price comparison • 4 pharmacies • Trusted sources
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
//             {/* SEARCH */}
//             <div className="relative w-full max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search medicine name..."
//                   value={search}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   className="pl-11 h-12 text-base bg-card border-border/70 focus-visible:ring-2 focus-visible:ring-primary"
//                 />
//               </div>

//               {/* SUGGESTIONS DROPDOWN - beautiful glassmorphism */}
//               {suggestions.length > 0 && (
//                 <div className="absolute w-full mt-2 bg-popover border border-border rounded-2xl shadow-2xl z-50 max-h-[320px] overflow-auto py-2">
//                   {suggestions.map((s) => (
//                     <div
//                       key={s.id}
//                       onClick={() => handleSelect(s.id)}
//                       className="px-5 py-3.5 hover:bg-accent cursor-pointer flex items-center gap-3 text-sm transition-colors"
//                     >
//                       <div className="h-2 w-2 rounded-full bg-primary/70" />
//                       {s.canonicalName}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* EXPORT BUTTON */}
//             <Button
//               onClick={exportCSV}
//               className="h-12 px-8 gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
//             >
//               <Download className="h-5 w-5" />
//               Export Full CSV
//             </Button>
//           </div>
//         </div>

//         {/* SINGLE RESULT BANNER */}
//         {totalPages === 1 && data.length === 1 && data[0] && (
//           <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="text-2xl">🔍</div>
//               <div>
//                 <p className="font-semibold text-lg">
//                   Showing single result:{" "}
//                   <span className="text-primary">{data[0].canonicalName}</span>
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   {data[0].brand} • {data[0].strength} • {data[0].form}
//                 </p>
//               </div>
//             </div>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setPage(1)
//                 loadMedicines(1)
//               }}
//               className="gap-2"
//             >
//               ← Back to All Medicines
//             </Button>
//           </div>
//         )}

//         {/* MAIN CARD */}
//         <Card className="overflow-hidden border-border/70 shadow-xl">
//           <Table>
//             <TableHeader className="bg-muted/60">
//               <TableRow>
//                 <TableHead className="w-14">ID</TableHead>
//                 <TableHead>Brand</TableHead>
//                 <TableHead>Strength</TableHead>
//                 <TableHead>Form</TableHead>
//                 <TableHead>Variant</TableHead>
//                 <TableHead className="w-20 text-center">Approved</TableHead>
//                 <TableHead className="text-right w-40">Products</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {data.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
//                     No medicines found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 data.map((med) => (
//                   <TableRow key={med.id} className="hover:bg-muted/40 transition-colors">
//                     <TableCell className="font-mono text-muted-foreground">{med.id}</TableCell>
//                     <TableCell className="font-semibold">{med.brand}</TableCell>
//                     <TableCell>{med.strength}</TableCell>
//                     <TableCell>{med.form}</TableCell>
//                     <TableCell className="uppercase text-xs tracking-widest text-muted-foreground">
//                       {med.variant}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                           med.approved
//                             ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
//                             : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
//                         }`}
//                       >
//                         {med.approved ? "✓ Yes" : "✕ No"}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedMedicine(med)
//                           setDialogOpen(true)
//                         }}
//                         className="hover:border-primary hover:text-primary transition-all"
//                       >
//                         View {med.products.length} offers
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </Card>

//         {/* PAGINATION - modern sliding window */}
//         {totalPages > 1 && (
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
//             <div className="text-sm text-muted-foreground font-medium">
//               Page <span className="text-foreground font-semibold">{page}</span> of{" "}
//               {totalPages} • {data.length} medicines per page
//             </div>

//             <div className="flex items-center gap-1.5">
//               {/* PREV */}
//               <Button
//                 variant="outline"
//                 disabled={page === 1}
//                 onClick={() => setPage(page - 1)}
//                 className="h-10 px-5 gap-2 hover:bg-secondary"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Prev
//               </Button>

//               {/* PAGE NUMBERS - max 9 with sliding */}
//               {generatePages().map((num) => (
//                 <Button
//                   key={num}
//                   variant={page === num ? "default" : "outline"}
//                   onClick={() => setPage(num)}
//                   className={`h-10 w-10 font-medium transition-all ${
//                     page === num
//                       ? "bg-primary text-primary-foreground shadow-md"
//                       : "hover:bg-muted"
//                   }`}
//                 >
//                   {num}
//                 </Button>
//               ))}

//               {/* NEXT */}
//               <Button
//                 variant="outline"
//                 disabled={page === totalPages}
//                 onClick={() => setPage(page + 1)}
//                 className="h-10 px-5 gap-2 hover:bg-secondary"
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       {/* </div> */}

//       {/* PRODUCT DETAIL DIALOG - clean comparison table */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//   <DialogContent
//     className="
//       max-w-[95vw]               /* safe max on very small screens */
//       sm:max-w-[min(90vw,1200px)] /* on sm+ take up to ~1200px or 90vw, whichever smaller */
//       lg:max-w-[min(85vw,1400px)] /* on lg+ a bit wider but still constrained */
//       max-h-[90vh]
//       p-0
//       overflow-hidden
//       rounded-3xl
//       flex
//       flex-col
//       bg-card
//     "
//   >
//     {/* Fixed header */}
//     <DialogHeader className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b bg-muted/30 shrink-0">
//       <DialogTitle className="text-xl sm:text-2xl font-semibold">
//         {selectedMedicine?.canonicalName}
//       </DialogTitle>
//       <DialogDescription className="text-sm sm:text-base mt-1.5 text-muted-foreground">
//         {selectedMedicine?.brand} • {selectedMedicine?.strength} • {selectedMedicine?.form} • {selectedMedicine?.variant}
//       </DialogDescription>
//     </DialogHeader>

//     {/* Scrollable area — both directions when needed */}
//     <div
//       className="
//         flex-1
//         overflow-auto
//         px-4 sm:px-6 lg:px-8
//         py-6
//         scrollbar-thin
//         scrollbar-thumb-muted
//         scrollbar-track-muted/40
//       "
//     >
//       {selectedMedicine && selectedMedicine.products.length > 0 ? (
//         <div className="min-w-[900px] lg:min-w-[1100px]"> {/* ← this forces horizontal scroll when viewport is narrower */}
//           <Table>
//             <TableHeader className="sticky top-0 bg-card z-10 border-b shadow-sm">
//               <TableRow>
//                 <TableHead className="w-28 sm:w-32 whitespace-nowrap">Source</TableHead>
//                 <TableHead className="min-w-[220px] sm:min-w-[280px] lg:min-w-[340px]">
//                   Product Name
//                 </TableHead>
//                 <TableHead className="w-24 sm:w-28 text-right whitespace-nowrap">Price</TableHead>
//                 <TableHead className="w-28 sm:w-32 text-right whitespace-nowrap">Original</TableHead>
//                 <TableHead className="w-28 text-center whitespace-nowrap">Discount</TableHead>
//                 <TableHead className="w-36 sm:w-44 text-right whitespace-nowrap">Link</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {selectedMedicine.products.map((p, idx) => (
//                 <TableRow
//                   key={idx}
//                   className="hover:bg-muted/40 transition-colors border-b last:border-none"
//                 >
//                   <TableCell className="font-medium text-primary">{p.source}</TableCell>
//                   <TableCell className="max-w-[340px] break-words hyphens-auto">
//                     {p.name}
//                   </TableCell>
//                   <TableCell className="text-right font-semibold text-emerald-600 tabular-nums">
//                     {p.price}
//                   </TableCell>
//                   <TableCell className="text-right text-muted-foreground line-through tabular-nums">
//                     {p.originalPrice || '—'}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
//                       {p.discount || '—'}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button
//                       variant="link"
//                       className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
//                       asChild
//                     >
//                       <a href={p.productUrl} target="_blank" rel="noopener noreferrer">
//                         View →
//                       </a>
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       ) : (
//         <div className="py-12 text-center text-muted-foreground">
//           No product offers available for this medicine.
//         </div>
//       )}
//     </div>

//     {/* Footer */}
//     <div className="px-6 sm:px-8 py-4 border-t bg-muted/20 shrink-0 flex justify-between items-center">
//       <div className="text-sm text-muted-foreground">
//         {selectedMedicine?.products.length || 0} offers found
//       </div>
//       <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
//         Close
//       </Button>
//     </div>
//   </DialogContent>
// </Dialog>
//     </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import {
  fetchMedicines,
  searchMedicines,
  searchById,
  deleteProduct,
  updateProduct,
  addProduct,
  approveMedicine,
} from "./medicineData";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

interface Product {
  id: number;
  source: string;
  name: string;
  pack: string;
  price: string;
  originalPrice: string;
  discount: string;
  productUrl: string;
  endpoint: string;
}

interface Medicine {
  id: number;
  brand: string;
  strength: string;
  form: string;
  variant: string;
  canonicalName: string;
  approved: boolean;
  products: Product[];
}

const formatPrice = (value?: string | number) => {
  if (!value) return "—";

  const v = String(value);

  if (v.includes("₹")) return v;

  return `₹${v}`;
};

const formatOriginalPrice = (value?: string | number) => {
  if (!value) return "—";

  const v = String(value);

  if (v.includes("₹")) return v;

  return `₹${v}`;
};

const formatDiscount = (value?: string | number) => {
  if (!value) return "—";

  const v = String(value);

  if (v.includes("%")) return v;

  return `${v}% OFF`;
};

const SOURCES = ["NETMEDS", "PHARMEASY", "ONEMG", "TRUEMEDS"];

export default function Medicine() {
  const [data, setData] = useState<Medicine[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Admin states
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set(),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const [addOpen, setAddOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    source: "",
    name: "",
    pack: "",
    price: "",
    originalPrice: "",
    discount: "",
    productUrl: "",
    endpoint: "",
  });

  const availableSources = selectedMedicine
    ? SOURCES.filter(
        (src) =>
          !selectedMedicine.products
            .map((p) => p.source.toLowerCase())
            .includes(src.toLowerCase()),
      )
    : [];

  useEffect(() => {
    if (search.trim() === "") {
      loadMedicines(page);
    }
  }, [page]);

  const loadMedicines = async (pageNumber: number) => {
    const res = await fetchMedicines(pageNumber, 10);
    setData(res.data);
    setTotalPages(res.totalPages);
  };

  // Search handlers
  const handleSearch = async (value: string) => {
    setSearch(value);
    if (value.trim() === "") {
      setSuggestions([]);
      loadMedicines(page);
      return;
    }
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    const res = await searchMedicines(value);
    setSuggestions(res);
  };

  const handleSelect = async (id: number) => {
    const res = await searchById(id);
    if (res.status === "FOUND") {
      setData([{ ...res.medicine, products: res.products }]);
      setSuggestions([]);
      setSearch("");
      setTotalPages(1);
      setPage(1);
    }
  };

  // CSV Export
  const exportCSV = async () => {
    let allData: Medicine[] = [];
    let currentPage = 1;
    let more = true;

    while (more) {
      const res = await fetchMedicines(currentPage, 50);
      allData = [...allData, ...res.data];
      if (currentPage >= res.totalPages) more = false;
      else currentPage++;
    }

    const rows: string[] = [];
    rows.push(
      "MedicineId,Brand,Strength,Form,Variant,CanonicalName,Source,ProductName,Pack,Price,OriginalPrice,Discount,ProductURL",
    );

    allData.forEach((med) => {
      med.products.forEach((prod) => {
        rows.push(
          `${med.id},"${med.brand.replace(/"/g, '""')}","${med.strength}","${med.form}","${med.variant}","${med.canonicalName.replace(/"/g, '""')}","${prod.source}","${prod.name.replace(/"/g, '""')}","${prod.pack}","${prod.price}","${prod.originalPrice}","${prod.discount}","${prod.productUrl}"`,
        );
      });
    });

    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `medicines_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Pagination
  const generatePages = () => {
    const MAX_VISIBLE = 9;
    let start = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
    let end = Math.min(totalPages, start + MAX_VISIBLE - 1);
    if (end - start + 1 < MAX_VISIBLE)
      start = Math.max(1, end - MAX_VISIBLE + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // ────────────────────────────────────────────────
  //                ADMIN FUNCTIONS
  // ────────────────────────────────────────────────

  const toggleProductSelection = (productId: number, checked: boolean) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (checked) newSet.add(productId);
      else newSet.delete(productId);
      return newSet;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (!selectedMedicine) return;
    if (checked) {
      setSelectedProducts(new Set(selectedMedicine.products.map((p) => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedMedicine || selectedProducts.size === 0) return;
    setIsDeleting(true);

    try {
      for (const pid of selectedProducts) {
        const prod = selectedMedicine.products.find((p) => p.id === pid);
        if (prod) await deleteProduct(selectedMedicine.id, prod.source);
      }

      // Refresh data
      const refreshed = await searchById(selectedMedicine.id);
      if (refreshed.status === "FOUND") {
        setSelectedMedicine({
          ...refreshed.medicine,
          products: refreshed.products,
        });
      }

      setSelectedProducts(new Set());
      alert("Selected products deleted successfully");
      loadMedicines(page);
    } catch (err: any) {
      alert("Error during deletion: " + (err.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setEditForm({ ...product });
  };

  const handleUpdate = async () => {
    if (!editProduct || !selectedMedicine) return;

    try {
      await updateProduct(editProduct.id, editForm);

      // Refresh
      const refreshed = await searchById(selectedMedicine.id);
      if (refreshed.status === "FOUND") {
        setSelectedMedicine({
          ...refreshed.medicine,
          products: refreshed.products,
        });
      }

      setEditProduct(null);
      alert("Product updated successfully");
      loadMedicines(page);
    } catch (err: any) {
      alert("Update failed: " + (err.message || "Unknown error"));
    }
  };

  const handleAddProduct = async () => {
    if (!selectedMedicine) return;

    try {
      await addProduct({
        medicineId: selectedMedicine.id,
        ...newProduct,
      });

      const refreshed = await searchById(selectedMedicine.id);

      if (refreshed.status === "FOUND") {
        setSelectedMedicine({
          ...refreshed.medicine,
          products: refreshed.products,
        });
      }

      setNewProduct({
        source: "",
        name: "",
        pack: "",
        price: "",
        originalPrice: "",
        discount: "",
        productUrl: "",
        endpoint: "",
      });

      setAddOpen(false);
      loadMedicines(page);
    } catch (err: any) {
      alert("Failed to add product");
    }
  };

  const handleApprove = async (med: any) => {
  try {
    await approveMedicine({
      canonicalName: med.canonicalName,
      brand: med.brand,
      strength: med.strength,
      form: med.form,
      variant: med.variant
    })

    // update UI instantly
    setData((prev) =>
      prev.map((m) =>
        m.id === med.id ? { ...m, approved: true } : m
      )
    )
  } catch (err) {
    console.error("Approve failed", err)
  }
}


  return (
    <div className="min-h-screen bg-background p-6">
      <div className=" mx-auto space-y-8">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
              Medicine Catalog
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Real-time price comparison • 4 pharmacies • Admin mode
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicine name..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-11 h-12 text-base bg-card border-border/70 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {suggestions.length > 0 && (
                <div className="absolute w-full mt-2 bg-popover border border-border rounded-2xl shadow-2xl z-50 max-h-[320px] overflow-auto py-2">
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelect(s.id)}
                      className="px-5 py-3.5 hover:bg-accent cursor-pointer flex items-center gap-3 text-sm transition-colors"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary/70" />
                      {s.canonicalName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={exportCSV}
              className="h-12 px-8 gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Download className="h-5 w-5" />
              Export Full CSV
            </Button>
          </div>
        </div>

        {/* Single result banner */}
        {totalPages === 1 && data.length === 1 && data[0] && (
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🔍</div>
              <div>
                <p className="font-semibold text-lg">
                  Showing single result:{" "}
                  <span className="text-primary">{data[0].canonicalName}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {data[0].brand} • {data[0].strength} • {data[0].form}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setPage(1);
                loadMedicines(1);
              }}
              className="gap-2"
            >
              ← Back to All
            </Button>
          </div>
        )}

        {/* Main Table */}
        <Card className="overflow-hidden border-border/70 shadow-xl">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead className="w-14">ID</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead className="w-20 text-center">Approved</TableHead>
                <TableHead className="text-right w-40">Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-40 text-center text-muted-foreground"
                  >
                    No medicines found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((med) => (
                  <TableRow
                    key={med.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="font-mono text-muted-foreground">
                      {med.id}
                    </TableCell>
                    <TableCell className="font-semibold">{med.brand}</TableCell>
                    <TableCell>{med.strength}</TableCell>
                    <TableCell>{med.form}</TableCell>
                    <TableCell className="uppercase text-xs tracking-widest text-muted-foreground">
                      {med.variant}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          med.approved
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                        }`}
                      >
                        {med.approved ? "✓ Yes" : "✕ No"}
                      </span>
                      {!med.approved && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleApprove(med)}
                        >
                          Approve
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMedicine(med);
                          setDialogOpen(true);
                          setSelectedProducts(new Set()); // reset selection
                        }}
                        className="hover:border-primary hover:text-primary transition-all"
                      >
                        Manage {med.products.length} offers
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
            <div className="text-sm text-muted-foreground font-medium">
              Page <span className="text-foreground font-semibold">{page}</span>{" "}
              of {totalPages}
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="h-10 px-5 gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>

              {generatePages().map((num) => (
                <Button
                  key={num}
                  variant={page === num ? "default" : "outline"}
                  onClick={() => setPage(num)}
                  className={`h-10 w-10 ${page === num ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted"}`}
                >
                  {num}
                </Button>
              ))}

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="h-10 px-5 gap-2"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────
            PRODUCT MANAGEMENT DIALOG (ADMIN)
        ──────────────────────────────────────────────── */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[min(90vw,1200px)] lg:max-w-[min(85vw,1400px)] max-h-[90vh] p-0 overflow-hidden rounded-3xl flex flex-col bg-card">
            <DialogHeader className="px-6 sm:px-8 pt-6 pb-5 border-b bg-muted/30 shrink-0">
              {/* <div className="flex items-center justify-between gap-4"> */}

              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setAddOpen(true)}
                    disabled={selectedMedicine?.products.length === 4}
                  >
                    Add Product
                  </Button>
                </div>

                <div>
                  <DialogTitle className="text-xl sm:text-2xl">
                    {selectedMedicine?.canonicalName}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 text-sm sm:text-base text-muted-foreground">
                    {selectedMedicine?.brand} • {selectedMedicine?.strength} •{" "}
                    {selectedMedicine?.form} • {selectedMedicine?.variant}
                  </DialogDescription>
                </div>

                {selectedProducts.size > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete ({selectedProducts.size})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {selectedProducts.size}{" "}
                          product(s). This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleBulkDelete}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-muted/40">
              {selectedMedicine && selectedMedicine.products.length > 0 ? (
                <div className="min-w-[900px] lg:min-w-[1100px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10 border-b shadow-sm">
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            checked={
                              selectedProducts.size ===
                                selectedMedicine.products.length &&
                              selectedMedicine.products.length > 0
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-32">Source</TableHead>
                        <TableHead className="min-w-[280px]">
                          Product Name
                        </TableHead>
                        <TableHead className="w-28 text-right">Price</TableHead>
                        <TableHead className="w-32 text-right">
                          Original Price
                        </TableHead>
                        <TableHead className="w-28 text-center">
                          Discount
                        </TableHead>
                        <TableHead className="w-36 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {selectedMedicine.products.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/30">
                          <TableCell>
                            <Checkbox
                              checked={selectedProducts.has(p.id)}
                              onCheckedChange={(checked) =>
                                toggleProductSelection(p.id, !!checked)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium text-primary">
                            {p.source}
                          </TableCell>
                          <TableCell className="max-w-[340px] break-words">
                            {p.name.slice(0,50)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600 tabular-nums">
                            {formatPrice(p.price)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground line-through tabular-nums">
                            {formatOriginalPrice(p.originalPrice) || "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {formatDiscount(p.discount) || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(p)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No products available for this medicine.
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t bg-muted/30 shrink-0 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedMedicine?.products.length || 0} products •{" "}
                {selectedProducts.size} selected
              </div>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ────────────────────────────────────────────────
            EDIT PRODUCT MODAL
        ──────────────────────────────────────────────── */}
        <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Product – {editProduct?.source}</DialogTitle>
              <DialogDescription>
                Update pricing and details. Changes will be saved immediately.
              </DialogDescription>
            </DialogHeader>

            {editProduct && (
              <div className="grid gap-5 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">Name</label>
                  <Input
                    className="col-span-3"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">Pack</label>
                  <Input
                    className="col-span-3"
                    value={editForm.pack || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, pack: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">
                      Price
                    </label>
                    <Input
                      className="col-span-3"
                      value={editForm.price || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">
                      Orig. Price
                    </label>
                    <Input
                      className="col-span-3"
                      value={editForm.originalPrice || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          originalPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">
                    Discount
                  </label>
                  <Input
                    className="col-span-3"
                    value={editForm.discount || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, discount: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">URL</label>
                  <Input
                    className="col-span-3"
                    value={editForm.productUrl || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, productUrl: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">ENDPOINT</label>
                  <Input
                    className="col-span-3"
                    value={editForm.endpoint || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, productUrl: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditProduct(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Product DIALOGE */}

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Add pharmacy offer for this medicine
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Source</label>

                <select
                  className="col-span-3 border rounded-md p-2"
                  value={newProduct.source}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, source: e.target.value })
                  }
                >
                  <option value="">Select Source</option>

                  {availableSources.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Name</label>
                <Input
                  className="col-span-3"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Pack</label>
                <Input
                  className="col-span-3"
                  value={newProduct.pack}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, pack: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">
                    Price
                  </label>
                  <Input
                    className="col-span-3"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium">
                    Original Price
                  </label>
                  <Input
                    className="col-span-3"
                    value={newProduct.originalPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Discount
                </label>
                <Input
                  className="col-span-3"
                  value={newProduct.discount}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, discount: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">URL</label>
                <Input
                  className="col-span-3"
                  value={newProduct.productUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, productUrl: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Endpoint
                </label>

                <Input
                  className="col-span-3"
                  placeholder="/api/netmeds/product"
                  value={newProduct.endpoint}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, endpoint: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
