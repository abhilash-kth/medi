// components/admin/medicines/EditProductDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import {
  formatPrice,
  formatOriginalPrice,
  formatDiscount,
} from "@/lib/medicineFormat";

interface EditProductDialogProps {
  editProduct: any | null;
  setEditProduct: (p: any | null) => void;
  editForm: any;
  setEditForm: (f: any) => void;
  handleUpdate: () => Promise<void>;
}

export default function EditProductDialog({
  editProduct,
  setEditProduct,
  editForm,
  setEditForm,
  handleUpdate,
}: EditProductDialogProps) {
  if (!editProduct) return null;

  // Local loading state for save action
  const [isSaving, setIsSaving] = useState(false);

  const onSaveClick = async () => {
    setIsSaving(true);
    try {
      await handleUpdate();
      // Dialog will close automatically from parent on success
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product – {editProduct.source}</DialogTitle>
          <DialogDescription>Update pricing, discount, URL and other details.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input
              className="col-span-3"
              value={editForm.name || ""}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Pack</Label>
            <Input
              className="col-span-3"
              value={editForm.pack || ""}
              onChange={(e) => setEditForm({ ...editForm, pack: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Price</Label>
              <Input
                className="col-span-3"
                value={editForm.price || ""}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                placeholder={formatPrice(editForm.price)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">MRP</Label>
              <Input
                className="col-span-3"
                value={editForm.originalPrice || ""}
                onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })}
                placeholder={formatOriginalPrice(editForm.originalPrice)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Discount</Label>
            <Input
              className="col-span-3"
              value={editForm.discount || ""}
              onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
              placeholder={formatDiscount(editForm.discount)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">URL</Label>
            <Input
              className="col-span-3"
              value={editForm.productUrl || ""}
              onChange={(e) => setEditForm({ ...editForm, productUrl: e.target.value })}
            />
          </div>

          {/* ── Added missing Endpoint field ── */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Endpoint</Label>
            <Input
              className="col-span-3"
              value={editForm.endpoint || ""}
              onChange={(e) => setEditForm({ ...editForm, endpoint: e.target.value })}
              placeholder="/api/netmeds/product"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setEditProduct(null)}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            onClick={onSaveClick}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}