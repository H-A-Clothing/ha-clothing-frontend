// Keeps the checkout form in sessionStorage, so it survives a refresh and the review page can read it.
// sessionStorage is cleared when the browser tab closes, so personal details don't stay on the device.
import { useEffect, useState } from "react";
import { EMPTY_DETAILS } from "../checkoutForm";

const STORAGE_KEY = "ha-checkout-details";

function readStoredDetails() {
  try {
    return { ...EMPTY_DETAILS, ...JSON.parse(sessionStorage.getItem(STORAGE_KEY)) };
  } catch {
    return EMPTY_DETAILS;
  }
}

export function useCheckoutDetails() {
  const [details, setDetails] = useState(readStoredDetails);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  }, [details]);

  // Changes one field, e.g. updateField("city", "Colombo").
  const updateField = (field, value) => setDetails((prev) => ({ ...prev, [field]: value }));

  return { details, updateField };
}