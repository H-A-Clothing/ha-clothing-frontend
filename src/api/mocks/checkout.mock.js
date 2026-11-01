// Mock cart pricing, used until the backend checkout module is merged.
// The response shape below is the contract the backend should return.
import { PRODUCTS, toListItem } from "./catalogue.mock";

const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_FEE = 12;

// Rounds to cents, because 0.1 + 0.2 is 0.30000000000000004 in JavaScript.
const roundMoney = (amount) => Math.round(amount * 100) / 100;

export function mockCartSummary(items) {
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
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return {
    lines,
    subtotal,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    total: roundMoney(subtotal + shippingFee),
  };
}