import Icon from "../../../components/Icon";
import { formatPrice } from "../../../utils/formatters";

export default function ActiveFilters({ filters, categories = [], onSetFilter, onToggle, onClear }) {
  const chips = [];

  if (filters.category) {
    const label = categories.find((c) => c.slug === filters.category)?.label ?? filters.category;
    chips.push({ key: "category", label, remove: () => onSetFilter("category", undefined) });
  }
  filters.sizes.forEach((size) =>
    chips.push({ key: `size-${size}`, label: `Size ${size}`, remove: () => onToggle("sizes", size) })
  );
  filters.colors.forEach((color) =>
    chips.push({ key: `color-${color}`, label: color, remove: () => onToggle("colors", color) })
  );
  if (filters.maxPrice !== undefined) {
    chips.push({
      key: "price",
      label: `Under ${formatPrice(filters.maxPrice)}`,
      remove: () => onSetFilter("maxPrice", undefined),
    });
  }
  if (filters.inStock) {
    chips.push({ key: "stock", label: "In stock", remove: () => onSetFilter("inStock", false) });
  }

  if (!chips.length) return null;

  return (
    <div className="active-filters">
      <span className="eyebrow">Applied filters:</span>
      {chips.map((chip) => (
        <button key={chip.key} type="button" className="filter-chip" onClick={chip.remove}>
          {chip.label} <Icon name="close" size={12} />
        </button>
      ))}
      <button type="button" className="link-underline" onClick={onClear}>
        Clear all
      </button>
    </div>
  );
}
