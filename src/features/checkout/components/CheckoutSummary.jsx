// Right-hand order summary on the checkout and review pages: items and totals.
import { formatPrice, pluralize } from "../../../utils/formatters";
import ProductImage from "../../shop/components/ProductImage";

export default function CheckoutSummary({ summary, children }) {
  const pieces = summary.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <aside className="cart-summary card">
      <div className="checkout-summary__head">
        <h2 className="cart-summary__title">
          Order <em>Summary</em>
        </h2>
        <span className="eyebrow">{pluralize(pieces, "piece")}</span>
      </div>

      <ul className="checkout-summary__lines">
        {summary.lines.map((line) => (
          <li key={`${line.productId}-${line.size}-${line.color}`}>
            <div className="checkout-summary__thumb">
              <ProductImage product={line.product} />
              <span>{line.quantity}</span>
            </div>
            <div>
              <strong>{line.product.name}</strong>
              <span className="muted">
                {line.color} · Size {line.size}
              </span>
            </div>
            <span>{formatPrice(line.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <dl className="cart-summary__rows">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(summary.subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>{summary.shippingFee === 0 ? "Free" : formatPrice(summary.shippingFee)}</dd>
        </div>
      </dl>

      <div className="cart-summary__total">
        <span className="eyebrow">Total</span>
        <strong>{formatPrice(summary.total)}</strong>
      </div>

      {children}
    </aside>
  );
}