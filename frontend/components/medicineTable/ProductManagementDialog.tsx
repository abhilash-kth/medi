// components/admin/medicines/ProductManagementDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Pencil, Trash2, Loader2 } from "lucide-react";

import {
  formatPrice,
  formatOriginalPrice,
  formatDiscount,
} from "@/lib/medicineFormat";

interface ProductManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMedicine: any | null;
  selectedProducts: Set<number>;
  toggleSelectAll: (checked: boolean) => void;
  toggleProductSelection: (id: number, checked: boolean) => void;
  handleBulkDelete: () => Promise<void>;
  openEditModal: (product: any) => void;
  isDeleting: boolean;
  setAddOpen: (open: boolean) => void;
}

export default function ProductManagementDialog({
  open,
  onOpenChange,
  selectedMedicine,
  selectedProducts,
  toggleSelectAll,
  toggleProductSelection,
  handleBulkDelete,
  openEditModal,
  isDeleting,
  setAddOpen,
}: ProductManagementDialogProps) {
  if (!selectedMedicine) return null;

  const allSelected =
    selectedProducts.size === selectedMedicine.products.length &&
    selectedMedicine.products.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl">{selectedMedicine.canonicalName}</DialogTitle>
          <DialogDescription className="mt-1.5">
            {selectedMedicine.brand} • {selectedMedicine.strength} • {selectedMedicine.form} •{" "}
            {selectedMedicine.variant}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
          <Button onClick={() => setAddOpen(true)} disabled={selectedMedicine.products.length >= 4}>
            + Add Product
          </Button>

          {selectedProducts.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete ({selectedProducts.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>{selectedProducts.size}</strong> product offer(s).  
                    This action cannot be undone.
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

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                </TableHead>
                <TableHead className="w-32">Source</TableHead>
                <TableHead className="min-w-[280px]">Product Name</TableHead>
                <TableHead className="w-28 text-right">Price</TableHead>
                <TableHead className="w-32 text-right">Original Price</TableHead>
                <TableHead className="w-28 text-center">Discount</TableHead>
                <TableHead className="w-36 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {selectedMedicine.products.map((p: any) => (
                <TableRow key={p.id} className="hover:bg-muted/40">
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.has(p.id)}
                      onCheckedChange={(checked) => toggleProductSelection(p.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-primary">{p.source}</TableCell>
                  <TableCell className="max-w-[340px] break-words">{p.name.slice(0, 50)}</TableCell>
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

        <DialogFooter className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mr-auto">
            {selectedMedicine.products.length} offers • {selectedProducts.size} selected
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}