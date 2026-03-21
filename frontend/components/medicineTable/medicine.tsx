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
  deleteMedicine,
  adminAddMedicine, // ← NEW IMPORT
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
  Plus,
} from "lucide-react";

// ── Imported separate dialog components ────────────────────────────────
import ProductManagementDialog from "@/components/medicineTable/ProductManagementDialog";
import EditProductDialog from "@/components/medicineTable/EditProductDialog";
import AddProductDialog from "@/components/medicineTable/AddProductDialog";

// ── Sonner toast ────────────────────────────────
import { toast } from "sonner";

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

  // Bulk medicine deletion
  const [selectedMedicines, setSelectedMedicines] = useState<Set<number>>(
    new Set(),
  );
  const [isDeletingMedicine, setIsDeletingMedicine] = useState(false);

  // Product management states
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set(),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);


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

  // ── States for Add Medicine feature ───────────────────────────────
  const [addMedicineOpen, setAddMedicineOpen] = useState(false);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);

  // ------Total Medicine Count ---------------------------
  const [totalCount, setTotalCount] = useState(0);

  // =============== Sorting Medicne State =========================
  const [approvedFilter, setApprovedFilter] = useState<
    "ALL" | "APPROVED" | "NOT_APPROVED"
  >("ALL");

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
  }, [page, approvedFilter]);

  // const loadMedicines = async (pageNumber: number) => {
  //   const res = await fetchMedicines(pageNumber, 10, approvedFilter);
  //   setData(res.data);
  //   setTotalPages(res.totalPages);
  //   setTotalCount(res.total);
  // };
  const loadMedicines = async (pageNumber: number) => {
  setLoading(true); // 🔄 start loading

  try {
    const res = await fetchMedicines(pageNumber, 10, approvedFilter);
    setData(res.data);
    setTotalPages(res.totalPages);
    setTotalCount(res.total);
  } catch (err) {
    console.error("Failed to load medicines", err);
  } finally {
    setLoading(false); // ✅ stop loading
  }
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

  // ── NEW: Handle admin adding medicine + redirect to product management ──
  const handleAdminAddMedicine = async () => {
    const trimmedName = newMedicineName.trim();
    if (!trimmedName) {
      toast.error("Please enter a medicine name");
      return;
    }

    setIsAddingMedicine(true);

    try {
      const result = await adminAddMedicine(trimmedName);

      // Adjust these lines according to your actual API response shape
      // Common patterns: result.medicine, result.data, result.id, etc.
      let medicineId: number | undefined;
      let canonicalName: string | undefined;

      if (result.status === "CREATED" || result.status === "success") {
        medicineId = result.medicine?.id || result.id || result.data?.id;
        canonicalName = result.medicine?.canonicalName || result.canonicalName;
      } else if (result.status === "ALREADY_EXISTS") {
        medicineId = result.id || result.medicineId || result.data?.id;
        canonicalName = result.canonicalName || result.data?.canonicalName;
        toast.warning("Medicine already exists", {
          description: canonicalName || trimmedName,
        });
      }

      if (!medicineId) {
        throw new Error("No medicine ID returned from server");
      }

      // Load the medicine details and auto-open product dialog
      const detail = await searchById(medicineId);
      if (detail.status === "FOUND") {
        setData([{ ...detail.medicine, products: detail.products }]);
        setTotalPages(1);
        setPage(1);
        setSearch("");
        setSuggestions([]);
        setSelectedMedicine({ ...detail.medicine, products: detail.products });
        setDialogOpen(true);

        toast.success("Ready to add products", {
          description: detail.medicine.canonicalName || trimmedName,
        });
      } else {
        toast.info("Medicine added, refreshing list...");
        loadMedicines(page);
      }

      setNewMedicineName("");
      setAddMedicineOpen(false);
    } catch (err: any) {
      toast.error("Failed to add medicine", {
        description: err.message || "Please check server response",
      });
      console.error("Add medicine error:", err);
    } finally {
      setIsAddingMedicine(false);
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

  const generatePages = () => {
    const MAX_VISIBLE = 9;
    let start = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
    let end = Math.min(totalPages, start + MAX_VISIBLE - 1);
    if (end - start + 1 < MAX_VISIBLE)
      start = Math.max(1, end - MAX_VISIBLE + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Bulk Medicine Selection & Deletion
  const toggleMedicineSelection = (medicineId: number, checked: boolean) => {
    setSelectedMedicines((prev) => {
      const next = new Set(prev);
      if (checked) next.add(medicineId);
      else next.delete(medicineId);
      return next;
    });
  };

  const toggleSelectAllMedicines = (checked: boolean) => {
    if (checked) {
      setSelectedMedicines(new Set(data.map((m) => m.id)));
    } else {
      setSelectedMedicines(new Set());
    }
  };

  const handleDeleteSelectedMedicines = async () => {
    if (selectedMedicines.size === 0) return;
    setIsDeletingMedicine(true);

    try {
      for (const medId of selectedMedicines) {
        await deleteMedicine(medId);
      }

      toast.success("Medicine deleted successfully", {
        description: `${selectedMedicines.size} medicine(s) and their products removed.`,
      });

      setSelectedMedicines(new Set());
      loadMedicines(page);
    } catch (err: any) {
      toast.error("Failed to delete medicine", {
        description: err.message || "An error occurred while deleting.",
      });
    } finally {
      setIsDeletingMedicine(false);
    }
  };

  // ── Existing product & approval handlers (unchanged) ──
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

  const handleBulkDeleteProducts = async () => {
    if (!selectedMedicine || selectedProducts.size === 0) return;
    setIsDeleting(true);

    try {
      for (const pid of selectedProducts) {
        const prod = selectedMedicine.products.find((p) => p.id === pid);
        if (prod) await deleteProduct(selectedMedicine.id, prod.source);
      }

      const refreshed = await searchById(selectedMedicine.id);
      if (refreshed.status === "FOUND") {
        setSelectedMedicine({
          ...refreshed.medicine,
          products: refreshed.products,
        });
      }

      setSelectedProducts(new Set());
      toast.success("Products deleted", {
        description: `${selectedProducts.size} product(s) removed successfully.`,
      });
      loadMedicines(page);
    } catch (err: any) {
      toast.error("Deletion failed", {
        description:
          err.message || "An error occurred while deleting products.",
      });
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

      const refreshed = await searchById(selectedMedicine.id);
      if (refreshed.status === "FOUND") {
        setSelectedMedicine({
          ...refreshed.medicine,
          products: refreshed.products,
        });
      }

      setEditProduct(null);
      toast.success("Product updated", {
        description: "Changes saved successfully.",
      });
      loadMedicines(page);
    } catch (err: any) {
      toast.error("Update failed", {
        description: err.message || "Could not update the product.",
      });
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
      toast.success("Product added", {
        description: "New product offer added successfully.",
      });
      loadMedicines(page);
    } catch (err: any) {
      toast.error("Failed to add product", {
        description:
          err.message || "An error occurred while adding the product.",
      });
    }
  };

  const handleApprove = async (med: any) => {
    try {
      await approveMedicine({
        canonicalName: med.canonicalName,
        brand: med.brand,
        strength: med.strength,
        form: med.form,
        variant: med.variant,
      });

      setData((prev) =>
        prev.map((m) => (m.id === med.id ? { ...m, approved: true } : m)),
      );

      toast.success("Medicine approved", {
        description: "The medicine is now approved and visible.",
      });
    } catch (err: any) {
      toast.error("Approval failed", {
        description: err.message || "Could not approve the medicine.",
      });
    }
  };

  // ================ Sorting Function by Toogle Handel =================
  const getIcon = () => {
  if (loading) return "⏳";
  if (approvedFilter === "APPROVED") return "✅";
  if (approvedFilter === "NOT_APPROVED") return "❌";
  return "🔄";
};

  const toggleApprovedFilter = () => {
    setPage(1); // reset pagination

    setApprovedFilter((prev) => {
      if (prev === "ALL") return "APPROVED";
      if (prev === "APPROVED") return "NOT_APPROVED";
      return "ALL";
    });
  };

  return (
    <div className="min-h-screen bg-[#9fd6ce]">
      <div className="mx-auto space-y-8">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground text-[#294c99]">
              Medicine Catalog
            </h1>
            <p className="mt-2 text-lg text-muted-foreground text-[#176e27]">
              Real-time price comparison • 4 pharmacies • Admin mode
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-end">
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

            {/* ADD MEDICINE BUTTON - placed right next to search */}
            <Button
              onClick={() => setAddMedicineOpen(true)}
              className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>

            <Button
              onClick={exportCSV}
              className="h-12 px-8 gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Download className="h-5 w-5" />
              Export Full CSV
            </Button>
          </div>
        </div>

        {/* Bulk Delete Button */}
        {selectedMedicines.size > 0 && (
          <div className="flex justify-end mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeletingMedicine}>
                  {isDeletingMedicine ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete {selectedMedicines.size} medicine(s)
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {selectedMedicines.size}{" "}
                    medicine(s) and all their associated products. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSelectedMedicines}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

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
        <Card className="overflow-hidden border-border/70 shadow-xl bg-[#bbc8dd]">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedMedicines.size === data.length && data.length > 0
                    }
                    onCheckedChange={toggleSelectAllMedicines}
                  />
                </TableHead>
                <TableHead className="w-14 font-bold text-[#1d498f]">ID</TableHead>
                <TableHead className="font-bold text-[#1d498f]">Brand</TableHead>
                <TableHead className="font-bold text-[#1d498f]">Strength</TableHead>
                <TableHead className="font-bold text-[#1d498f]">Form</TableHead>
                <TableHead className="font-bold text-[#1d498f]">Variant</TableHead>
                {/* <TableHead className="w-20 text-center">Approved</TableHead> */}
                <TableHead className="w-20 text-center">
                  <Button variant="ghost" onClick={toggleApprovedFilter} disabled={loading} className="font-bold text-[#1d498f]">
                    Approved {getIcon()}
                  </Button>
                </TableHead>

                <TableHead className="text-right w-40 font-bold text-[#1d498f]">Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
                    <TableCell>
                      <Checkbox
                        checked={selectedMedicines.has(med.id)}
                        onCheckedChange={(checked) =>
                          toggleMedicineSelection(med.id, !!checked)
                        }
                      />
                    </TableCell>
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
                          setSelectedProducts(new Set());
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
            {/* <div className="text-sm text-muted-foreground font-medium">
              Page <span className="text-foreground font-semibold">{page}</span>{" "}
              of {totalPages}
            </div> */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
              <div>
                Total Medicines:{" "}
                <span className="text-foreground font-semibold">
                  {totalCount}
                </span>
              </div>

              <div>
                Page{" "}
                <span className="text-foreground font-semibold">{page}</span> of{" "}
                {totalPages}
              </div>
            </div>
            {/*  */}
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

        {/* ── NEW: Add Medicine Dialog ── */}
        <AlertDialog open={addMedicineOpen} onOpenChange={setAddMedicineOpen}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Medicine</AlertDialogTitle>
              <AlertDialogDescription className="space-y-1.5">
                Enter the medicine name (will be parsed automatically)
                <span className="block text-xs text-muted-foreground mt-1.5">
                  Examples: Dolo 650 Tablet, Pantop 40mg Capsule, Augmentin 625
                  Duo Tablet
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="py-4">
              <Input
                placeholder="Medicine name"
                value={newMedicineName}
                onChange={(e) => setNewMedicineName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdminAddMedicine();
                  }
                }}
                disabled={isAddingMedicine}
                autoFocus
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isAddingMedicine}>
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={handleAdminAddMedicine}
                disabled={isAddingMedicine || !newMedicineName.trim()}
                className="min-w-[140px]"
              >
                {isAddingMedicine ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add & Manage Products"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Existing dialogs */}
        <ProductManagementDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          selectedMedicine={selectedMedicine}
          selectedProducts={selectedProducts}
          toggleSelectAll={toggleSelectAll}
          toggleProductSelection={toggleProductSelection}
          handleBulkDelete={handleBulkDeleteProducts}
          openEditModal={openEditModal}
          isDeleting={isDeleting}
          setAddOpen={setAddOpen}
        />

        <AddProductDialog
          open={addOpen}
          setOpen={setAddOpen}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddProduct={handleAddProduct}
          availableSources={availableSources}
        />

        <EditProductDialog
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          editForm={editForm}
          setEditForm={setEditForm}
          handleUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
