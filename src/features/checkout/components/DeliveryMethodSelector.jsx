// Radio buttons for standard / express / pickup delivery.
import { formatPrice } from "../../../utils/formatters";

function feeLabel(option, subtotal) {
  if (option.fee === 0) return "Free";
  if (option.freeFrom !== null && subtotal >= option.freeFrom) return "Free";
  return formatPrice(option.fee);
}

export default function DeliveryMethodSelector({ options, value, subtotal, onChange }) {
  return (
    <section className="checkout-section card">
      <h2 className="checkout-section__title">
        <span>03</span> Delivery method
      </h2>
      <div className="delivery-options" role="radiogroup" aria-label="Delivery method">
        {options.map((option) => (
          <label key={option.id} className={`delivery-option ${value === option.id ? "is-selected" : ""}`}>
            <input
              type="radio"
              name="deliveryMethod"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className="delivery-option__text">
              <strong>{option.label}</strong>
              <span className="muted">
                {option.description}
                {option.freeFrom !== null && ` · free from ${formatPrice(option.freeFrom)}`}
              </span>
            </span>
            <span className="delivery-option__fee">{feeLabel(option, subtotal)}</span>
          </label>
        ))}
      </div>
    </section>
  );
}