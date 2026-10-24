
// Checkout API calls (Member 2) -> backend modules/checkout.
import { apiClient, mockResponse } from "./client";
import { USE_MOCKS } from "../utils/constants";
import { mockCartSummary } from "./mocks/checkout.mock";

// body: { items: [{ productId, size, color, quantity }] }
// returns: { lines[], subtotal, shippingFee, freeShippingThreshold, total }
// The server works out prices and totals, so the browser never decides what the customer pays.
export function getCartSummary(items) {
  if (USE_MOCKS) return mockResponse(mockCartSummary(items));
  return apiClient.post("/checkout/cart/summary", { items });
}