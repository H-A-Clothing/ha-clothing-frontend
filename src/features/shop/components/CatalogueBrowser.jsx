// Sidebar + toolbar + grid + pagination, shared by the catalogue and search pages.
import { useState } from "react";
import Icon from "../../../components/Icon";
import Pagination from "../../../components/Pagination";
import { getFilterOptions } from "../../../api/catalogue";
import { useFetch } from "../../../hooks/useFetch";
import { SORT_OPTIONS } from "../../../utils/constants";
import { useCatalogueFilters } from "../hooks/useCatalogueFilters";
import { useProducts } from "../hooks/useProducts";
import ActiveFilters from "./ActiveFilters";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import PromoAside from "./PromoAside";
import SizeGuideModal from "./SizeGuideModal";

const PAGE_SIZE = 12;

// `baseQuery` holds params fixed by the route, e.g. { category: "dresses" } or { collection: "sale" }.
export default function CatalogueBrowser({ baseQuery = {}, header, empty }) {
  const { filters, activeCount, setFilter, toggleInList, setPage, clearAll } = useCatalogueFilters();
  const { data: options } = useFetch(getFilterOptions, []);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const query = { ...filters, ...baseQuery, limit: PAGE_SIZE };
  const { data, loading, error } = useProducts(query);
  const showCategories = !baseQuery.category;

  const handlers = { onSetFilter: setFilter, onToggle: toggleInList, onClear: clearAll };

  const changePage = (page) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {header({ total: data?.total, loading })}

      <div className="container">
        <ActiveFilters filters={filters} categories={options?.categories} {...handlers} />

        <div className="catalogue">
          <div className={`catalogue__sidebar${filtersOpen ? " is-open" : ""}`}>
            <button type="button" className="catalogue__sidebar-close icon-btn" onClick={() => setFiltersOpen(false)}>
              <Icon name="close" />
            </button>
            <FilterSidebar
              options={options}
              filters={filters}
              activeCount={activeCount}
              showCategories={showCategories}
              onOpenSizeGuide={() => setSizeGuideOpen(true)}
              {...handlers}
            />
            <PromoAside />
          </div>

          <div className="catalogue__main">
            <div className="catalogue__toolbar">
              <button type="button" className="btn btn--outline catalogue__filter-btn" onClick={() => setFiltersOpen(true)}>
                <Icon name="filter" size={16} /> Filters {activeCount > 0 && `(${activeCount})`}
              </button>
              <span className="muted">
                {data && (data.total
                  ? `Showing ${(data.page - 1) * PAGE_SIZE + 1}–${Math.min(data.page * PAGE_SIZE, data.total)} of ${data.total} pieces`
                  : "No pieces found")}
              </span>
              <label className="sort-select">
                <span className="eyebrow">Sort:</span>
                <select value={filters.sort} onChange={(event) => setFilter("sort", event.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error ? (
              <p className="empty-state">Something went wrong loading products. Please try again.</p>
            ) : (
              <ProductGrid
                products={data?.items}
                loading={loading}
                empty={
                  empty ?? (
                    <div className="empty-state">
                      <h3>No pieces match these filters</h3>
                      <button type="button" className="btn btn--outline" onClick={clearAll}>
                        Clear filters
                      </button>
                    </div>
                  )
                }
              />
            )}

            {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={changePage} />}
          </div>
        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}
