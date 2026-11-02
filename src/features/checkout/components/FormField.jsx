// A label + input + error message, used by every field on the checkout form.
export default function FormField({ id, label, error, optional = false, children }) {
  return (
    <div className="checkout-field">
      <label className="field-label" htmlFor={id}>
        {label} {optional && <span className="checkout-field__optional">(optional)</span>}
      </label>
      {children}
      {error && (
        <p className="checkout-field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}