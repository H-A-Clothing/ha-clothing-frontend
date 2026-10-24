import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import { CheckoutSteps } from "../../../components/layout/CheckoutLayout";
import { PAYMENT_STATUS } from "../../../utils/constants";
import { formatDate } from "../../../utils/formatters";
import { OrderItems, OrderTotals } from "../components/OrderSummary";
import { usePaymentStatus } from "../hooks/usePaymentStatus";
import "../payment.css";

const METHOD_LABELS = { stripe: "Stripe", payhere: "PayHere" };

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("ref");
  const { payment, loading, error } = usePaymentStatus(reference);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="container pay-center">
        <span className="eyebrow">Confirming your payment…</span>
        <div className="pay-skeleton pay-skeleton--short" aria-busy="true" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="container pay-center">
        <h1>We couldn't find this payment</h1>
        <Link to="/" className="btn btn--primary">Return home</Link>
      </div>
    );
  }

  if (payment.status === PAYMENT_STATUS.FAILED) {
    return <Navigate to={`/payment/failure?ref=${encodeURIComponent(reference)}`} replace />;
  }

  const { order } = payment;

  const copyReference = async () => {
    await navigator.clipboard?.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="container">
      <CheckoutSteps current={4} />
      <div className="result card">
        <div className="result__icon result__icon--success">
          <Icon name="check" size={26} strokeWidth={2} />
        </div>
        <span className="eyebrow eyebrow--accent">Order secured</span>
        <h1 className="result__title">
          Thank You for Your <em>Order</em>
        </h1>
        <button type="button" className="result__ref" onClick={copyReference}>
          Order reference #{order.id} <Icon name="copy" size={14} /> {copied ? "Copied" : "Copy"}
        </button>
        <p className="muted result__text">
          A confirmation has been sent to <strong>{order.customer.email}</strong> with your invoice and order
          details.
        </p>

        <div className="result__grid">
          <div>
            <div className="result__section-head">
              <span className="eyebrow">Your pieces ({order.items.length})</span>
            </div>
            <OrderItems items={order.items} />
          </div>

          <aside className="result__aside">
            <span className="eyebrow">Estimated delivery</span>
            <p className="result__big">
              {formatDate(order.estimatedDelivery.from)} – {formatDate(order.estimatedDelivery.to)}
            </p>

            <span className="eyebrow">Delivery address</span>
            <p>
              <strong>{order.customer.name}</strong>
              <br />
              {order.shippingAddress}
            </p>

            <OrderTotals order={order} totalLabel="Total paid" />
            <p className="muted result__method">
              <Icon name="card" size={14} /> {METHOD_LABELS[payment.method] ?? payment.method}
              {payment.cardLast4 && ` · Card ending ${payment.cardLast4}`}
            </p>
          </aside>
        </div>

        <div className="result__actions">
          <Link to="/account/orders" className="btn btn--primary">
            View my orders <Icon name="arrowRight" size={14} />
          </Link>
          <Link to="/shop" className="btn btn--accent">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
