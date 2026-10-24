// Shows the product photo, or a soft tinted placeholder until real images are added.
export default function ProductImage({ product, className = "" }) {
  if (product.image) {
    return <img className={`product-image ${className}`} src={product.image} alt={product.name} loading="lazy" />;
  }

  const tone = product.colors?.[0]?.hex ?? "#b8a4e3";
  return (
    <div
      className={`product-image product-image--placeholder ${className}`}
      style={{ "--tone": tone }}
      role="img"
      aria-label={product.name}
    >
      <span>H&amp;A</span>
    </div>
  );
}
