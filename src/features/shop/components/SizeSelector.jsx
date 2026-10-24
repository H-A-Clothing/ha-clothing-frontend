// sizes: [{ size, stock }]. Out-of-stock sizes are disabled.
export default function SizeSelector({ sizes, value, onChange, compact = false }) {
  return (
    <div className={`size-grid${compact ? " size-grid--compact" : ""}`}>
      {sizes.map(({ size, stock }) => (
        <button
          key={size}
          type="button"
          className={`size-btn${value === size ? " is-selected" : ""}`}
          disabled={stock === 0}
          aria-pressed={value === size}
          title={stock === 0 ? "Out of stock" : undefined}
          onClick={() => onChange(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
