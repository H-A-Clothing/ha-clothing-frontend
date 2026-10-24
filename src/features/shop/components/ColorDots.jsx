export default function ColorDots({ colors, selected, onSelect, size = "sm" }) {
  return (
    <div className={`color-dots color-dots--${size}`}>
      {colors.map((color) => {
        const isSelected = selected === color.name;
        const className = `color-dot${isSelected ? " is-selected" : ""}`;
        const style = { background: color.hex };

        return onSelect ? (
          <button
            key={color.name}
            type="button"
            className={className}
            style={style}
            title={color.name}
            aria-label={color.name}
            aria-pressed={isSelected}
            onClick={() => onSelect(color.name)}
          />
        ) : (
          <span key={color.name} className={className} style={style} title={color.name} />
        );
      })}
    </div>
  );
}
