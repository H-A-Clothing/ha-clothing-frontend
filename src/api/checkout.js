// Checkout API calls (Member 2) -> backend modules/checkout.
import { apiClient, mockResponse } from "./client";
import { USE_MOCKS } from "../utils/constants";
import { DELIVERY_OPTIONS, mockCartSummary } from "./mocks/checkout.mock";

// body: { items: [{ productId, size, color, quantity }], deliveryMethod }
// returns: { lines[], subtotal, deliveryMethod, shippingFee, freeShippingThreshold, total }
// The server works out prices and totals, so the browser never decides what the customer pays.
export function getCartSummary(items, deliveryMethod = "standard") {
  if (USE_MOCKS) return mockResponse(mockCartSummary(items, deliveryMethod));
  return apiClient.post("/checkout/cart/summary", { items, deliveryMethod });
}

// returns: [{ id, label, description, fee, freeFrom }]
export function getDeliveryOptions() {
  if (USE_MOCKS) return mockResponse(DELIVERY_OPTIONS);
  return apiClient.get("/checkout/delivery-options");
}