// Stripe payment API calls (Member 1) -> backend modules/payments-stripe.
// Contract (agree with Member 2): initiate -> provider callback/webhook -> status.
import { apiClient, mockResponse } from "./client";
import { USE_MOCKS } from "../utils/constants";
import { MOCK_ORDER, mockInitiate, mockStatus } from "./mocks/payments.mock";

// Order created by Member 2's checkout, shown on the payment page.
export function getOrderForPayment(orderId) {
  if (USE_MOCKS) return mockResponse({ ...MOCK_ORDER, id: orderId ?? MOCK_ORDER.id });
  return apiClient.get(`/orders/${orderId}`);
}

// body: { orderId, method: "stripe" | "payhere", idempotencyKey }
// returns: { reference, status, redirectUrl? } — redirect when the provider hosts the payment step.
export function initiatePayment(body) {
  if (USE_MOCKS) return mockResponse(mockInitiate(body), 900);
  return apiClient.post("/payments/initiate", body);
}

// returns: { reference, orderId, method, status, amount, cardLast4?, failureReason?, order }
export function getPaymentStatus(reference) {
  if (USE_MOCKS) return mockResponse(mockStatus(reference));
  return apiClient.get(`/payments/${reference}/status`);
}
