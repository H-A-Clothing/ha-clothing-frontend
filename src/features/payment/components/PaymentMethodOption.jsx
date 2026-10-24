export default function PaymentMethodOption({ value, selected, onSelect, title, description, badges = [], children }) {
  const isSelected = selected === value;

  return (
    <div className={`pay-method${isSelected ? " is-selected" : ""}`}>
      <label className="pay-method__head">
        <input
          type="radio"
          name="payment-method"
          value={value}
          checked={isSelected}
          onChange={() => onSelect(value)}
        />
        <span className="pay-method__radio" aria-hidden="true" />
        <span className="pay-method__text">
          <strong>{title}</strong>
          <span className="muted">{description}</span>
        </span>
        <span className="pay-method__badges">
          {badges.map((badge) => (
            <span key={badge} className="pay-badge">
              {badge}
            </span>
          ))}
        </span>
      </label>
      {isSelected && children && <div className="pay-method__body">{children}</div>}
    </div>
  );
}
