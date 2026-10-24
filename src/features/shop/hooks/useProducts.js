import { getProducts } from "../../../api/catalogue";
import { useFetch } from "../../../hooks/useFetch";

// Re-fetches whenever any query parameter changes.
export function useProducts(params) {
  const key = JSON.stringify(params);
  return useFetch(() => getProducts(params), [key]);
}
