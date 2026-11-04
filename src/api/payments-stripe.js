// Payment API calls (Member 1) -> backend modules/payments and modules/payments-stripe.
// Contract: ha-clothing-backend/docs/payment-api-contract.md (agreed with Member 2).
import { apiClient, mockResponse } from "./client";
import { USE_MOCKS } from "../utils/constants";
import { MOCK_ORDER, mockCancel, mockInitiate, mockStatus } from "./mocks/payments.mock";

// Order created by Member 2's checkout, shown on the payment page. orderId is the order number, e.g. HA-94281.
export function getOrderForPayment(orderId) {
  if (USE_MOCKS) return mockResponse({ ...MOCK_ORDER, id: orderId ?? MOCK_ORDER.id });
  return apiClient.get(`/orders/${encodeURIComponent(orderId)}`);
}

// body: { orderId, method: "stripe" | "payhere", idempotencyKey }
// returns: { reference, status, redirectUrl? (Stripe), payhere?: { action, fields } (PayHere) }
export function initiatePayment(body) {
  if (USE_MOCKS) return mockResponse(mockInitiate(body), 900);
  return apiClient.post("/payments/initiate", body);
}

// returns: { reference, orderId, method, status, amount, currency, cardLast4?, failureReason?, order }
export function getPaymentStatus(reference) {
  if (USE_MOCKS) return mockResponse(mockStatus(reference));
  return apiClient.get(`/payments/${encodeURIComponent(reference)}/status`);
}

// The customer pressed "back" on Stripe's page: close it, so it can't be paid later. Returns the status object.
export function cancelStripePayment(reference) {
  if (USE_MOCKS) return mockResponse(mockCancel(reference));
  return apiClient.post("/payments/stripe/cancel", { reference });
}
