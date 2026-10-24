import Icon from "../../../components/Icon";
import { formatPrice } from "../../../utils/formatters";

export function OrderItems({ items }) {
  return (
    <ul className="order-items">
      {items.map((item) => (
        <li key={item.id} className="order-item">
          <div className="order-item__thumb">
            <span>{item.quantity}×</span>
          </div>
          <div className="order-item__info">
            <span className="eyebrow eyebrow--accent">{item.collection}</span>
            <h4>{item.name}</h4>
            <span className="muted">
              {item.color} · Size {item.size} · Qty {item.quantity}
            </span>
          </div>
          <span className="order-item__price">{formatPrice(item.unitPrice * item.quantity)}</span>
        </li>
      ))}
    </ul>
  );
}

export function OrderTotals({ order, totalLabel = "Total due" }) {
  return (
    <>
      <dl className="totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(order.subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd className={order.shippingFee ? undefined : "accent"}>
            {order.shippingFee ? formatPrice(order.shippingFee) : "Complimentary"}
          </dd>
        </div>
        {order.discount?.amount > 0 && (
          <div className="accent">
            <dt>Discount ({order.discount.code})</dt>
            <dd>−{formatPrice(order.discount.amount)}</dd>
          </div>
        )}
        <div>
          <dt>Taxes & duties</dt>
          <dd>{formatPrice(order.tax)}</dd>
        </div>
      </dl>
      <div className="totals__grand">
        <span className="eyebrow">{totalLabel}</span>
        <strong>{formatPrice(order.total)}</strong>
      </div>
    </>
  );
}

export default function OrderSummary({ order }) {
  const pieces = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="pay-panel card">
      <div className="pay-panel__head">
        <h2>
          Order <em>Summary</em>
        </h2>
        <span className="eyebrow">{pieces} pieces</span>
      </div>
      <OrderItems items={order.items} />
      {order.discount?.code && (
        <div className="promo-applied">
          <span>
            <Icon name="gift" size={14} /> {order.discount.code} applied
          </span>
          <span>−{formatPrice(order.discount.amount)}</span>
        </div>
      )}
      <OrderTotals order={order} />
      <p className="pay-panel__foot muted">
        <Icon name="shield" size={14} /> 14-day exchanges · Complimentary returns
      </p>
    </aside>
  );
}
