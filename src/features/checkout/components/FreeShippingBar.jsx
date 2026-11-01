// Shows how much more the customer needs to spend for free delivery.
import Icon from "../../../components/Icon";
import { formatPrice } from "../../../utils/formatters";

export default function FreeShippingBar({ subtotal, threshold }) {
  const remaining = threshold - subtotal;
  const percent = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="ship-bar">
      <p className="ship-bar__text">
        <Icon name="truck" size={18} />
        {remaining > 0 ? (
          <span>
            Add <strong>{formatPrice(remaining)}</strong> more for complimentary courier delivery.
          </span>
        ) : (
          <span>You've unlocked complimentary courier delivery.</span>
        )}
      </p>
      <div className="ship-bar__track">
        <div className="ship-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}