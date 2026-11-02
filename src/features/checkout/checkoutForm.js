// Checkout form fields, Sri Lankan districts and validation rules (Member 2).
// Field names match the shipping_* columns in the orders table.

export const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
  "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
  "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
  "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

export const EMPTY_DETAILS = {
  email: "",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  district: "",
  postalCode: "",
  country: "Sri Lanka",
  deliveryMethod: "standard",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 07X XXX XXXX or +94 7X XXX XXXX (spaces and dashes are ignored).
const PHONE_PATTERN = /^(\+94|0)\d{9}$/;
const POSTAL_CODE_PATTERN = /^\d{5}$/;

// Returns an object like { email: "Enter a valid email address." }. Empty object = no errors.
export function validateDetails(details) {
  const errors = {};
  const phone = details.phone.replace(/[\s-]/g, "");

  if (!EMAIL_PATTERN.test(details.email.trim())) errors.email = "Enter a valid email address.";
  if (details.name.trim().length < 2) errors.name = "Enter the recipient's full name.";
  if (!PHONE_PATTERN.test(phone)) errors.phone = "Enter a Sri Lankan number, e.g. 077 123 4567.";
  if (details.deliveryMethod !== "pickup") {
    if (!details.line1.trim()) errors.line1 = "Enter the street address.";
    if (!details.city.trim()) errors.city = "Enter the city.";
    if (!details.district) errors.district = "Choose a district.";
    if (details.postalCode && !POSTAL_CODE_PATTERN.test(details.postalCode.trim())) {
      errors.postalCode = "Postal codes have 5 digits.";
    }
  }

  return errors;
}