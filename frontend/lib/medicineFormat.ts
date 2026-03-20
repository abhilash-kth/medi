// lib/medicineFormat.ts
export const formatPrice = (value?: string | number) => {
  if (!value) return "—";
  const v = String(value);
  if (v.includes("₹")) return v;
  return `₹${v}`;
};

export const formatOriginalPrice = (value?: string | number) => {
  if (!value) return "—";
  const v = String(value);
  if (v.includes("₹")) return v;
  return `₹${v}`;
};

export const formatDiscount = (value?: string | number) => {
  if (!value) return "—";
  const v = String(value);
  if (v.includes("%")) return v;
  return `${v}% OFF`;
};