import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import { CheckoutSteps } from "../../../components/layout/CheckoutLayout";
import { getOrderForPayment, initiatePayment } from "../../../api/payments-stripe";
import { useFetch } from "../../../hooks/useFetch";
import { PAYMENT_METHODS, PAYMENT_STATUS } from "../../../utils/constants";
import { formatPrice } from "../../../utils/formatters";
import OrderSummary from "../components/OrderSummary";
import PaymentMethodOption from "../components/PaymentMethodOption";
import StripeCardFields from "../components/StripeCardFields";
import "../payment.css";

// One idempotency key per order, so retries and double clicks can't create a second payment.
function getIdempotencyKey(orderId) {
  const storageKey = `ha-pay-key-${orderId}`;
  let key = sessionStorage.getItem(storageKey);
  if (!key) {
    key = crypto.randomUUID();
    sessionStorage.setItem(storageKey, key);
  }
  return key;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const { data: order, loading, error } = useFetch(() => getOrderForPayment(orderId), [orderId]);

  const [method, setMethod] = useState(PAYMENT_METHODS.STRIPE);
  const [billingMatches, setBillingMatches] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const pay = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await initiatePayment({
        orderId: order.id,
        method,
        idempotencyKey: getIdempotencyKey(order.id),
      });

      if (result.redirectUrl) {
        // Hosted payment page (Stripe Checkout or PayHere) returns to /payment/success or /payment/failure.
        window.location.assign(result.redirectUrl);
        return;
      }
      const target = result.status === PAYMENT_STATUS.FAILED ? "failure" : "success";
      navigate(`/payment/${target}?ref=${encodeURIComponent(result.reference)}`);
    } catch (err) {
      setSubmitError(err.message || "We couldn't start the payment. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><div className="pay-skeleton" aria-busy="true" /></div>;

  if (error || !order) {
    return (
      <div className="container pay-center">
        <h1>We couldn't load your order</h1>
        <Link to="/cart" className="btn btn--primary">Back to bag</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <CheckoutSteps current={3} />
      <h1 className="page-title pay-title">
        Finalise <em>Payment</em>
      </h1>

      <div className="pay-layout">
        <form className="pay-panel card" onSubmit={pay}>
          <div className="pay-panel__head">
            <h2>
              Select <em>Payment</em> Method
            </h2>
            <span className="tag">SSL secured</span>
          </div>

          <PaymentMethodOption
            value={PAYMENT_METHODS.STRIPE}
            selected={method}
            onSelect={setMethod}
            title="Credit / Debit Card"
            description="International cards, processed securely by Stripe"
            badges={["Visa", "MC", "Amex"]}
          >
            <StripeCardFields />
          </PaymentMethodOption>

          <PaymentMethodOption
            value={PAYMENT_METHODS.PAYHERE}
            selected={method}
            onSelect={setMethod}
            title="PayHere"
            description="Sri Lankan cards, bank accounts and mobile wallets"
            badges={["LKR"]}
          >
            <p className="muted pay-method__note">
              You'll be taken to PayHere's secure page to complete payment, then returned here.
            </p>
          </PaymentMethodOption>

          <label className="checkbox pay-billing">
            <input type="checkbox" checked={billingMatches} onChange={(e) => setBillingMatches(e.target.checked)} />
            <span>
              Billing address matches shipping address
              <br />
              <strong>{order.shippingAddress}</strong>
            </span>
          </label>

          {submitError && <p className="form-error">{submitError}</p>}

          <button type="submit" className="btn btn--primary btn--block pay-submit" disabled={submitting}>
            <Icon name="lock" size={16} />
            {submitting ? "Processing…" : `Pay now — ${formatPrice(order.total)}`}
          </button>
          <p className="pay-secure muted">
            <Icon name="shield" size={14} /> Encrypted connection · Card details are never stored by H&amp;A
          </p>
        </form>

        <OrderSummary order={order} />
      </div>
    </div>
  );
}
