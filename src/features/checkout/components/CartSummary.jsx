// Order summary box on the bag page: subtotal, delivery, total and the checkout button.
import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";
import { formatPrice } from "../../../utils/formatters";

export default function CartSummary({ summary, canCheckout }) {
  return (
    <aside className="cart-summary card">
      <h2 className="cart-summary__title">
        Order <em>Summary</em>
      </h2>

      <dl className="cart-summary__rows">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(summary.subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>{summary.shippingFee === 0 ? "Complimentary" : formatPrice(summary.shippingFee)}</dd>
        </div>
      </dl>

      <div className="cart-summary__total">
        <span className="eyebrow">Total</span>
        <strong>{formatPrice(summary.total)}</strong>
      </div>
      <p className="muted cart-summary__note">Delivery options and taxes are confirmed at checkout.</p>

      {canCheckout ? (
        <Link to="/checkout" className="btn btn--primary btn--block">
          <Icon name="lock" size={16} /> Proceed to checkout
        </Link>
      ) : (
        <button type="button" className="btn btn--primary btn--block" disabled>
          Fix the items above to continue
        </button>
      )}

      <ul className="cart-summary__trust muted">
        <li>
          <Icon name="shield" size={14} /> Secure payment with PayHere or Stripe
        </li>
        <li>
          <Icon name="gift" size={14} /> 14-day exchanges and complimentary returns
        </li>
      </ul>
    </aside>
  );
}