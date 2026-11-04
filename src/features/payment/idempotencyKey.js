// One idempotency key per payment attempt, kept in sessionStorage.
// Retries, double clicks and the back button reuse it, so the backend returns the same payment
// instead of creating a second one. Once an attempt fails or is cancelled, the key is forgotten,
// so "Try again" starts a new attempt.
const storageKey = (orderId) => `ha-pay-key-${orderId}`;

export function getIdempotencyKey(orderId) {
  let key = sessionStorage.getItem(storageKey(orderId));
  if (!key) {
    key = crypto.randomUUID();
    sessionStorage.setItem(storageKey(orderId), key);
  }
  return key;
}

export function forgetIdempotencyKey(orderId) {
  sessionStorage.removeItem(storageKey(orderId));
}
