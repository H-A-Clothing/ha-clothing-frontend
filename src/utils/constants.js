// Shared frontend constants.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export const STORE_NAME = "H&A Clothing";
export const CURRENCY = "USD";

export const SIZES = ["XS", "S", "M", "L", "XL"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "bestselling", label: "Bestselling" },
];

export const PAYMENT_METHODS = {
  STRIPE: "stripe",
  PAYHERE: "payhere",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
};
