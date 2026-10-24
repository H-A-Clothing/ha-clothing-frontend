// Reads the payment status, polling while the provider callback is still pending.
import { useEffect, useState } from "react";
import { getPaymentStatus } from "../../../api/payments-stripe";
import { PAYMENT_STATUS } from "../../../utils/constants";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 15;

export function usePaymentStatus(reference) {
  const [state, setState] = useState({ payment: null, loading: true, error: null });

  useEffect(() => {
    if (!reference) {
      setState({ payment: null, loading: false, error: new Error("Missing payment reference") });
      return undefined;
    }

    let cancelled = false;
    let timer;
    let polls = 0;

    const check = async () => {
      try {
        const payment = await getPaymentStatus(reference);
        if (cancelled) return;
        const pending = payment.status === PAYMENT_STATUS.PENDING && polls < MAX_POLLS;
        setState({ payment, loading: pending, error: null });
        if (pending) {
          polls += 1;
          timer = setTimeout(check, POLL_INTERVAL_MS);
        }
      } catch (error) {
        if (!cancelled) setState({ payment: null, loading: false, error });
      }
    };

    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reference]);

  return state;
}
