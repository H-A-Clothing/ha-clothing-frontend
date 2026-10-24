import { SIZES } from "../../../utils/constants";
import { formatPrice } from "../../../utils/formatters";

const PRICE_CHIPS = [100, 150, 200];

function FilterSection({ title, action, children }) {
  return (
    <section className="filter-section">
      <div className="filter-section__head">
        <h4 className="eyebrow">{title}</h4>
        {action}
      </div>
      {children}
    </section>
  );
}

// `showCategories` is false on category pages, where the category comes from the URL path.
export default function FilterSidebar({
  options,
  filters,
  activeCount,
  onSetFilter,
  onToggle,
  onClear,
  onOpenSizeGuide,
  showCategories = true,
}) {
  const priceMax = options?.priceRange?.max ?? 250;
  const currentMax = filters.maxPrice ?? priceMax;

  return (
    <div className="filter-panel card">
      <div className="filter-panel__head">
        <h3>Filter By</h3>
        {activeCount > 0 && (
          <button type="button" className="link-underline" onClick={onClear}>
            Clear ({activeCount})
          </button>
        )}
      </div>

      {showCategories && options?.categories && (
        <FilterSection title="Category">
          <ul className="filter-list">
            {options.categories.map((category) => (
              <li key={category.slug}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={filters.category === category.slug}
                    onChange={() =>
                      onSetFilter("category", filters.category === category.slug ? undefined : category.slug)
                    }
                  />
                  <span>{category.label}</span>
                  <span className="checkbox__count">{category.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection
        title="Size"
        action={
          onOpenSizeGuide && (
            <button type="button" className="link-underline" onClick={onOpenSizeGuide}>
              Size Guide
            </button>
          )
        }
      >
        <div className="size-grid">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-btn${filters.sizes.includes(size) ? " is-selected" : ""}`}
              aria-pressed={filters.sizes.includes(size)}
              onClick={() => onToggle("sizes", size)}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {options?.colors && (
        <FilterSection title="Colour Palette">
          <div className="swatch-grid">
            {options.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                className={`swatch${filters.colors.includes(color.name) ? " is-selected" : ""}`}
                aria-pressed={filters.colors.includes(color.name)}
                onClick={() => onToggle("colors", color.name)}
              >
                <span className="color-dot" style={{ background: color.hex }} />
                {color.name}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Price Ceiling" action={<span className="filter-value">{formatPrice(currentMax)}</span>}>
        <input
          type="range"
          className="range"
          min={50}
          max={priceMax}
          step={10}
          value={currentMax}
          onChange={(event) => {
            const value = Number(event.target.value);
            onSetFilter("maxPrice", value >= priceMax ? undefined : value);
          }}
        />
        <div className="chip-row">
          {PRICE_CHIPS.map((value) => (
            <button
              key={value}
              type="button"
              className={`chip${filters.maxPrice === value ? " is-selected" : ""}`}
              onClick={() => onSetFilter("maxPrice", filters.maxPrice === value ? undefined : value)}
            >
              Under {formatPrice(value).replace(".00", "")}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <label className="toggle">
          <span>In stock only</span>
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(event) => onSetFilter("inStock", event.target.checked)}
          />
          <span className="toggle__track" aria-hidden="true" />
        </label>
      </FilterSection>
    </div>
  );
}
