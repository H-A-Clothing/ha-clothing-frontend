// Catalogue API calls (Member 1) -> backend modules/catalogue.
import { apiClient, mockResponse } from "./client";
import { USE_MOCKS } from "../utils/constants";
import {
  COLORS,
  PRICE_RANGE,
  PRODUCTS,
  categoriesWithCounts,
  findProduct,
  queryProducts,
  toListItem,
} from "./mocks/catalogue.mock";

// params: { category, q, sizes[], colors[], minPrice, maxPrice, inStock, collection, sort, page, limit }
// returns: { items, total, page, totalPages }
export function getProducts(params = {}) {
  if (USE_MOCKS) return mockResponse(queryProducts(params));
  return apiClient.get("/catalogue/products", params);
}

// returns: product with sizes[{ size, stock }], colors[], related[]
export async function getProduct(slug) {
  if (USE_MOCKS) {
    const product = findProduct(slug);
    if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });
    return mockResponse(product);
  }
  return apiClient.get(`/catalogue/products/${slug}`);
}

// returns: [{ slug, label, note, count }]
export function getCategories() {
  if (USE_MOCKS) return mockResponse(categoriesWithCounts());
  return apiClient.get("/catalogue/categories");
}

// returns: { categories, colors, priceRange }
export function getFilterOptions() {
  if (USE_MOCKS) {
    return mockResponse({
      categories: categoriesWithCounts(),
      colors: Object.values(COLORS),
      priceRange: PRICE_RANGE,
    });
  }
  return apiClient.get("/catalogue/filters");
}

// Wishlist. Mock mode resolves the locally stored ids to products.
export function getWishlistProducts(ids) {
  if (USE_MOCKS) {
    return mockResponse(PRODUCTS.filter((p) => ids.includes(p.id)).map(toListItem));
  }
  return apiClient.get("/catalogue/wishlist");
}

export function addToWishlist(productId) {
  if (USE_MOCKS) return mockResponse(null, 0);
  return apiClient.post("/catalogue/wishlist", { productId });
}

export function removeFromWishlist(productId) {
  if (USE_MOCKS) return mockResponse(null, 0);
  return apiClient.delete(`/catalogue/wishlist/${productId}`);
}
