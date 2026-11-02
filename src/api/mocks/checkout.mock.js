// Mock cart pricing, used until the backend checkout module is merged.
// The response shape below is the contract the backend should return.
import { PRODUCTS, toListItem } from "./catalogue.mock";

const FREE_SHIPPING_THRESHOLD = 150;

// Delivery methods match the delivery_method column in the orders table: standard, express, pickup.
export const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard courier",
    description: "3–5 working days, island-wide",
    fee: 12,
    freeFrom: FREE_SHIPPING_THRESHOLD,
  },
  {
    id: "express",
    label: "Express courier",
    description: "1–2 working days, tracked",
    fee: 15,
    freeFrom: null,
  },
  {
    id: "pickup",
    label: "Store pickup",
    description: "Collect from our Colombo atelier",
    fee: 0,
    freeFrom: null,
  },
];

// Rounds to cents, because 0.1 + 0.2 is 0.30000000000000004 in JavaScript.
const roundMoney = (amount) => Math.round(amount * 100) / 100;

function deliveryFee(deliveryMethod, subtotal) {
  const option = DELIVERY_OPTIONS.find((o) => o.id === deliveryMethod) ?? DELIVERY_OPTIONS[0];
  if (subtotal === 0) return 0;
  if (option.freeFrom !== null && subtotal >= option.freeFrom) return 0;
  return option.fee;
}

export function mockCartSummary(items, deliveryMethod = "standard") {
  const lines = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;

      const unitPrice = product.salePrice ?? product.price;
      const stockForSize = product.sizes.find((s) => s.size === item.size)?.stock ?? 0;

      return {
        ...item,
        product: toListItem(product),
        unitPrice,
        lineTotal: roundMoney(unitPrice * item.quantity),
        maxQuantity: stockForSize,
      };
    })
    .filter(Boolean);

  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const shippingFee = deliveryFee(deliveryMethod, subtotal);

  return {
    lines,
    subtotal,
    deliveryMethod,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    total: roundMoney(subtotal + shippingFee),
  };
}