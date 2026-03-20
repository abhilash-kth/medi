// components/admin/medicines/AddProductDialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

import {
  formatPrice,
  formatOriginalPrice,
  formatDiscount,
} from "@/lib/medicineFormat";

interface AddProductDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  newProduct: any;
  setNewProduct: (prod: any) => void;
  handleAddProduct: () => Promise<void>;
  availableSources: string[];
}

export default function AddProductDialog({
  open,
  setOpen,
  newProduct,
  setNewProduct,
  handleAddProduct,
  availableSources,
}: AddProductDialogProps) {
  // Local loading state for this dialog
  const [isAdding, setIsAdding] = useState(false);

  const onAddClick = async () => {
    setIsAdding(true);
    try {
      await handleAddProduct();
      // Dialog will close automatically from parent after success
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product Offer</DialogTitle>
          <DialogDescription>
            Add pricing, link and endpoint from one of the supported pharmacies.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source" className="text-right">
              Source
            </Label>
            <Select
              value={newProduct.source}
              onValueChange={(value) =>
                setNewProduct({ ...newProduct, source: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select pharmacy" />
              </SelectTrigger>
              <SelectContent>
                {availableSources.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Product display name"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pack" className="text-right">
              Pack
            </Label>
            <Input
              id="pack"
              className="col-span-3"
              value={newProduct.pack}
              onChange={(e) => setNewProduct({ ...newProduct, pack: e.target.value })}
              placeholder="e.g. 10 Tablets"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                className="col-span-3"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder={formatPrice(newProduct.price)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="originalPrice" className="text-right">
                MRP
              </Label>
              <Input
                id="originalPrice"
                className="col-span-3"
                value={newProduct.originalPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, originalPrice: e.target.value })
                }
                placeholder={formatOriginalPrice(newProduct.originalPrice)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">
              Discount
            </Label>
            <Input
              id="discount"
              className="col-span-3"
              value={newProduct.discount}
              onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
              placeholder={formatDiscount(newProduct.discount)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productUrl" className="text-right">
              Product URL
            </Label>
            <Input
              id="productUrl"
              className="col-span-3"
              value={newProduct.productUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productUrl: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right">
              Endpoint
            </Label>
            <Input
              id="endpoint"
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
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isAdding}>
            Cancel
          </Button>

          <Button
            onClick={onAddClick}
            disabled={
              isAdding ||
              !newProduct.source ||
              !newProduct.name ||
              !newProduct.endpoint
            }
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}