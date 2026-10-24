// Demo card fields matching the design.
// IMPORTANT: card numbers must never reach our own backend. When Stripe is connected, replace these
// inputs with Stripe's <PaymentElement /> from @stripe/react-stripe-js (or redirect to Stripe Checkout).
// The values typed here are not stored or sent anywhere.
import Icon from "../../../components/Icon";

export default function StripeCardFields() {
  return (
    <div className="card-fields">
      <div>
        <label className="field-label" htmlFor="card-name">Cardholder name</label>
        <input id="card-name" className="input" autoComplete="off" placeholder="Name on card" />
      </div>
      <div>
        <label className="field-label" htmlFor="card-number">Card number</label>
        <div className="input-icon">
          <input id="card-number" className="input" autoComplete="off" inputMode="numeric" placeholder="4242 4242 4242 4242" />
          <Icon name="card" size={18} />
        </div>
      </div>
      <div className="card-fields__row">
        <div>
          <label className="field-label" htmlFor="card-expiry">Expires MM/YY</label>
          <input id="card-expiry" className="input" autoComplete="off" placeholder="09/28" />
        </div>
        <div>
          <label className="field-label" htmlFor="card-cvc">CVC</label>
          <input id="card-cvc" className="input" autoComplete="off" inputMode="numeric" placeholder="•••" />
        </div>
      </div>
      <p className="card-fields__note muted">Demo fields. Stripe's secure card form will replace these.</p>
    </div>
  );
}
