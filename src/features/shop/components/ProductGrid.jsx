import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading, columns = 3, skeletonCount = 6, empty }) {
  if (loading) {
    return (
      <div className={`product-grid product-grid--${columns}`} aria-busy="true">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div key={index} className="product-card product-card--skeleton" />
        ))}
      </div>
    );
  }

  if (!products?.length) return empty ?? null;

  return (
    <div className={`product-grid product-grid--${columns}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
