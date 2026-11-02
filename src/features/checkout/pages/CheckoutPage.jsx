// Checkout details page (Member 2): contact, shipping address and delivery method.
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Icon from "../../../components/Icon";
import { CheckoutSteps } from "../../../components/layout/CheckoutLayout";
import { getCartSummary, getDeliveryOptions } from "../../../api/checkout";
import { useCart } from "../../../context/CartContext";
import { useFetch } from "../../../hooks/useFetch";
import { validateDetails } from "../checkoutForm";
import { useCheckoutDetails } from "../hooks/useCheckoutDetails";
import CheckoutSummary from "../components/CheckoutSummary";
import DeliveryMethodSelector from "../components/DeliveryMethodSelector";
import ShippingAddressForm from "../components/ShippingAddressForm";
import "../checkout.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useCart();
  const { details, updateField } = useCheckoutDetails();
  const [errors, setErrors] = useState({});

  const { data: options } = useFetch(() => getDeliveryOptions(), []);
  const { data: summary } = useFetch(
    () => getCartSummary(items, details.deliveryMethod),
    [JSON.stringify(items), details.deliveryMethod]
  );

  // Nothing to check out: send the customer back to the bag.
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const handleChange = (field, value) => {
    updateField(field, value);
    // Clear a field's error as soon as the customer edits it.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the browser reloading the page
    const found = validateDetails(details);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move the cursor to the first field with a problem.
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    navigate("/checkout/review");
  };

  return (
    <div className="container">
      <CheckoutSteps current={2} />
      <h1 className="page-title checkout-title">
        Delivery <em>Details</em>
      </h1>

      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <ShippingAddressForm
            details={details}
            errors={errors}
            onChange={handleChange}
            showAddress={details.deliveryMethod !== "pickup"}
          />

          {options && summary && (
            <DeliveryMethodSelector
              options={options}
              value={details.deliveryMethod}
              subtotal={summary.subtotal}
              onChange={(method) => handleChange("deliveryMethod", method)}
            />
          )}

          <div className="checkout-actions">
            <Link to="/cart" className="link-underline">
              <Icon name="arrowLeft" size={14} /> Back to bag
            </Link>
            <button type="submit" className="btn btn--primary">
              Review order <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </form>

        {summary && <CheckoutSummary summary={summary} />}
      </div>
    </div>
  );
}