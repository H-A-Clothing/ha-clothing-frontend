import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import { CheckoutSteps } from "../../../components/layout/CheckoutLayout";
import { getOrderForPayment, initiatePayment } from "../../../api/payments-stripe";
import { useFetch } from "../../../hooks/useFetch";
import { PAYMENT_METHODS, PAYMENT_STATUS } from "../../../utils/constants";
import { formatPrice } from "../../../utils/formatters";
import OrderSummary from "../components/OrderSummary";
import PaymentMethodOption from "../components/PaymentMethodOption";
import { getIdempotencyKey } from "../idempotencyKey";
import "../payment.css";

const CLOSED_STATUSES = [PAYMENT_STATUS.FAILED, PAYMENT_STATUS.CANCELLED];

// PayHere needs a real form POST (with a signed hash), not a link.
function submitPayHereForm({ action, fields }) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const { data: order, loading, error } = useFetch(() => getOrderForPayment(orderId), [orderId]);

  const [method, setMethod] = useState(PAYMENT_METHODS.STRIPE);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // The browser's back button from Stripe can restore this page from its cache, still "Redirecting…".
  useEffect(() => {
    const reset = (event) => {
      if (event.persisted) setSubmitting(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

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

      // Card details are typed on Stripe's / PayHere's own page, never on ours.
      // They send the customer back to /payment/success or /payment/failure.
      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }
      if (result.payhere) {
        submitPayHereForm(result.payhere);
        return;
      }
      const target = CLOSED_STATUSES.includes(result.status) ? "failure" : "success";
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

  if (order.status && order.status !== "pending_payment") {
    return (
      <div className="container pay-center">
        <h1>
          Order #{order.id} {order.status === "cancelled" ? "was cancelled" : "is already paid"}
        </h1>
        <Link to="/shop" className="btn btn--primary">Continue shopping</Link>
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
            <p className="muted pay-method__note">
              You'll enter your card on Stripe's secure page, then come back here.
            </p>
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

          <div className="pay-delivery">
            <span className="eyebrow">Delivering to</span>
            <strong>{order.customer.name}</strong>
            <span className="muted">{order.shippingAddress}</span>
          </div>

          {submitError && <p className="form-error">{submitError}</p>}

          <button type="submit" className="btn btn--primary btn--block pay-submit" disabled={submitting}>
            <Icon name="lock" size={16} />
            {submitting ? "Redirecting…" : `Pay now — ${formatPrice(order.total)}`}
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
