// Keeps catalogue filters in the URL (?sizes=S,M&colors=Lilac%20Mist&maxPrice=200&sort=newest&page=2)
// so filtered pages can be shared and survive a refresh.
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const LIST_KEYS = ["sizes", "colors"];

export function useCatalogueFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const list = (key) => searchParams.get(key)?.split(",").filter(Boolean) ?? [];
    const number = (key) => (searchParams.has(key) ? Number(searchParams.get(key)) : undefined);
    return {
      q: searchParams.get("q") ?? "",
      category: searchParams.get("category") ?? undefined,
      sizes: list("sizes"),
      colors: list("colors"),
      maxPrice: number("maxPrice"),
      inStock: searchParams.get("inStock") === "true",
      sort: searchParams.get("sort") ?? "newest",
      page: number("page") ?? 1,
    };
  }, [searchParams]);

  const update = (changes, { resetPage = true } = {}) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => {
        const empty = value === undefined || value === null || value === "" || value === false;
        if (empty || (Array.isArray(value) && value.length === 0)) next.delete(key);
        else next.set(key, Array.isArray(value) ? value.join(",") : String(value));
      });
      if (resetPage) next.delete("page");
      return next;
    });
  };

  const toggleInList = (key, value) => {
    const current = filters[key];
    update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
  };

  const clearAll = () => {
    const keep = filters.q ? { q: filters.q } : {};
    setSearchParams(keep);
  };

  const activeCount =
    LIST_KEYS.reduce((sum, key) => sum + filters[key].length, 0) +
    (filters.category ? 1 : 0) +
    (filters.maxPrice !== undefined ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  return {
    filters,
    activeCount,
    setFilter: (key, value) => update({ [key]: value }),
    toggleInList,
    setPage: (page) => update({ page: page === 1 ? undefined : page }, { resetPage: false }),
    clearAll,
  };
}
