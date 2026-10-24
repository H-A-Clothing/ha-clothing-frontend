import { Link, useSearchParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import { CheckoutSteps } from "../../../components/layout/CheckoutLayout";
import { formatPrice } from "../../../utils/formatters";
import { usePaymentStatus } from "../hooks/usePaymentStatus";
import "../payment.css";

const NEXT_STEPS = [
  { title: "Card details", text: "Check the card number, expiry date and billing address, or try another card." },
  { title: "3D Secure", text: "Look for a one-time passcode or approval request in your banking app." },
  { title: "PayHere", text: "Switch to PayHere for Sri Lankan cards, bank accounts and mobile wallets." },
];

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("ref");
  const { payment, loading } = usePaymentStatus(reference);

  const orderId = payment?.orderId ?? payment?.order?.id;
  const retryUrl = orderId ? `/payment?order=${encodeURIComponent(orderId)}` : "/cart";

  return (
    <div className="container container--narrow">
      <CheckoutSteps current={3} failed />
      <div className="result card result--narrow">
        <div className="result__icon">
          <Icon name="cardOff" size={26} />
        </div>
        {orderId && <span className="eyebrow">Attempted reference #{orderId}</span>}
        <h1 className="result__title">
          Payment was <em>not completed</em>
        </h1>

        {!loading && (
          <div className="result__notice">
            <p>
              <Icon name="info" size={16} /> Your payment
              {payment?.amount ? (
                <>
                  {" "}of <strong>{formatPrice(payment.amount)}</strong>
                </>
              ) : null}{" "}
              could not be authorised.
            </p>
            {payment?.failureReason && <blockquote>“{payment.failureReason}”</blockquote>}
            <p className="muted">
              <Icon name="clock" size={14} /> No money has been taken. Your items are still in your bag.
            </p>
          </div>
        )}

        <div className="result__steps">
          <span className="eyebrow">Recommended next steps</span>
          <div className="result__steps-grid">
            {NEXT_STEPS.map((step, index) => (
              <div key={step.title} className="step-card">
                <span className="eyebrow">
                  0{index + 1} {step.title}
                </span>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="result__actions result__actions--split">
          <Link to={retryUrl} className="btn btn--primary">
            Try again <Icon name="arrowRight" size={14} />
          </Link>
          <Link to="/cart" className="btn btn--outline">
            <Icon name="arrowLeft" size={14} /> Back to bag
          </Link>
        </div>

        <p className="result__help muted">
          Still having trouble? <Link to="/contact" className="link-inline">Contact our client care team</Link>.
        </p>
      </div>
    </div>
  );
}
