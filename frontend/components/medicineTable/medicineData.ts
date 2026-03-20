import api from "@/lib/axios"

// ---------------- MEDICINES ----------------

export const fetchMedicines = async (page = 1, limit = 20) => {
  const res = await api.get("/medicine-data", {
    params: { page, limit },
  })
  return res.data
}

export const searchMedicines = async (q: string) => {
  const res = await api.get("/autocomplete", {
    params: { q },
  })
  return res.data
}

export const searchById = async (id: number) => {
  const res = await api.get("/search/by-id", {
    params: { medicineId: id },
  })
  return res.data
}

// ---------------- PRODUCT ----------------

export const deleteProduct = async (medicineId: number, source: string) => {
  try {
    const res = await api.delete("/admin/product", {
      params: {
        medicineId,
        source,
      },
    })
    return res.data
  } catch (error: any) {
    console.error("Delete product error:", error)
    throw error?.response?.data || { message: "Failed to delete product" }
  }
}

export const updateProduct = async (
  productId: number,
  payload: Partial<{
    name?: string
    pack?: string
    price?: string
    originalPrice?: string
    discount?: string
    productUrl?: string
    endpoint?: string
  }>
) => {
  try {
    const res = await api.put(`/admin/product/${productId}`, payload)
    return res.data
  } catch (error: any) {
    console.error("Update product error:", error)
    throw error?.response?.data || { message: "Failed to update product" }
  }
}

export const addProduct = async (payload: {
  medicineId: number
  source: string
  name: string
  pack?: string
  price?: string
  originalPrice?: string
  discount?: string
  productUrl?: string
  endpoint?: string
}) => {
  try {
    const res = await api.post("/admin/add-product", payload)
    return res.data
  } catch (error: any) {
    console.error("Add product error:", error)
    throw error?.response?.data || { message: "Failed to add product" }
  }
}

// ---------------- MEDICINE APPROVAL ----------------

export const approveMedicine = async (payload: {
  canonicalName: string
  brand: string
  strength: string
  form: string
  variant: string
}) => {
  try {
    const res = await api.post("/admin/approve-medicine", payload)
    return res.data
  } catch (error: any) {
    console.error("Approve medicine error:", error)
    throw error?.response?.data || { message: "Failed to approve medicine" }
  }
}

export const deleteMedicine = async (medicineId: number) => {
  try {
    const res = await api.delete(`/admin/medicine/${medicineId}`); // ✅ FIXED
    return res.data;
  } catch (error: any) {
    console.error("Delete medicine error:", error);
    throw error?.response?.data || { message: "Failed to delete medicine" };
  }
};

export const adminAddMedicine = async (name: string) => {
  try {
    const res = await api.post("/admin/add-medicine", { name })
    return res.data
  } catch (error: any) {
    console.error("Admin add medicine error:", error)
    throw error?.response?.data || { message: "Failed to add medicine" }
  }
}