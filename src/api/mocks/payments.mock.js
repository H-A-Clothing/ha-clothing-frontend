// Mock payment flow, used until the shared payment API (Members 1 and 2) is merged.
// The shapes below are a proposal for the initiate / status contract.
import { PAYMENT_STATUS } from "../../utils/constants";

export const MOCK_ORDER = {
  id: "HA-94281",
  customer: { name: "Elena Perera", email: "elena@example.com" },
  shippingAddress: "12 Flower Road, Colombo 07, Sri Lanka",
  items: [
    { id: 1, name: "Tailored A-Line Midi Dress", collection: "Silk Capsule", color: "Lilac Mist", size: "S", quantity: 1, unitPrice: 185 },
    { id: 2, name: "Contrast Binding Fitted Top", collection: "Separates", color: "Obsidian", size: "M", quantity: 1, unitPrice: 112 },
  ],
  subtotal: 297,
  discount: { code: "SPRING25", amount: 25 },
  shippingFee: 0,
  tax: 50,
  total: 322,
  estimatedDelivery: { from: "2026-10-29", to: "2026-11-01" },
};

// sessionStorage keeps mock payments alive across a page refresh.
const STORAGE_KEY = "ha-mock-payments";
const payments = {
  get: (reference) => JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}")[reference],
  set: (reference, payment) => {
    const all = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...all, [reference]: payment }));
  },
};

export function mockInitiate({ orderId, method }) {
  const reference = `${orderId}-${Date.now().toString(36).toUpperCase()}`;
  const payment = {
    reference,
    orderId,
    method,
    status: PAYMENT_STATUS.SUCCEEDED,
    amount: MOCK_ORDER.total,
    cardLast4: method === "stripe" ? "4242" : null,
    paidAt: new Date().toISOString(),
  };
  payments.set(reference, payment);
  return { reference, status: payment.status, redirectUrl: null };
}

// Unknown references come back as failed, so /payment/failure?ref=anything shows the failure page.
export function mockStatus(reference) {
  const payment = payments.get(reference) ?? {
    reference,
    orderId: MOCK_ORDER.id,
    method: "stripe",
    status: PAYMENT_STATUS.FAILED,
    amount: MOCK_ORDER.total,
    failureReason: "Card authorisation declined by the issuing bank (3D Secure incomplete or insufficient funds).",
  };
  return { ...payment, order: MOCK_ORDER };
}
