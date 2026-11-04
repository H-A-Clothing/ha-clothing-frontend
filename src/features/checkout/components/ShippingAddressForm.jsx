// Contact details and shipping address on the checkout page.
import { SRI_LANKA_DISTRICTS } from "../checkoutForm";
import FormField from "./FormField";

export default function ShippingAddressForm({ details, errors, onChange, showAddress }) {
  // Builds the props every text input needs, so each field below stays short.
  const inputProps = (field) => ({
    id: field,
    className: `input ${errors[field] ? "input--error" : ""}`,
    value: details[field],
    onChange: (event) => onChange(field, event.target.value),
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <>
      <section className="checkout-section card">
        <h2 className="checkout-section__title">
          <span>01</span> Contact details
        </h2>
        <div className="checkout-fields">
          <FormField id="email" label="Email address" error={errors.email}>
            <input type="email" autoComplete="email" {...inputProps("email")} />
          </FormField>
          <FormField id="phone" label="Mobile number" error={errors.phone}>
            <input type="tel" autoComplete="tel" placeholder="077 123 4567" {...inputProps("phone")} />
          </FormField>
        </div>
      </section>

      <section className="checkout-section card">
        <h2 className="checkout-section__title">
          <span>02</span> {showAddress ? "Shipping address" : "Who is collecting?"}
        </h2>
        <div className="checkout-fields">
          <FormField id="name" label="Full name" error={errors.name}>
            <input type="text" autoComplete="name" {...inputProps("name")} />
          </FormField>

          {showAddress && (
            <>
              <FormField id="line1" label="Street address" error={errors.line1}>
                <input type="text" autoComplete="address-line1" {...inputProps("line1")} />
              </FormField>
              <FormField id="line2" label="Apartment, suite, floor" optional>
                <input type="text" autoComplete="address-line2" {...inputProps("line2")} />
              </FormField>
              <div className="checkout-fields checkout-fields--2">
                <FormField id="city" label="City" error={errors.city}>
                  <input type="text" autoComplete="address-level2" {...inputProps("city")} />
                </FormField>
                <FormField id="district" label="District" error={errors.district}>
                  <select {...inputProps("district")}>
                    <option value="">Choose…</option>
                    {SRI_LANKA_DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
              <div className="checkout-fields checkout-fields--2">
                <FormField id="postalCode" label="Postal code" optional error={errors.postalCode}>
                  <input type="text" inputMode="numeric" autoComplete="postal-code" {...inputProps("postalCode")} />
                </FormField>
                <FormField id="country" label="Country">
                  <input type="text" {...inputProps("country")} readOnly />
                </FormField>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}