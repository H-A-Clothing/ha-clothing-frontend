import { Link } from "react-router-dom";
import ColorDots from "./ColorDots";
import Price from "./Price";
import ProductImage from "./ProductImage";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card__media">
        <ProductImage product={product} />
        {product.badge && (
          <span className={`tag product-card__badge${product.badge === "Sale" ? " tag--dark" : ""}`}>
            {product.badge}
          </span>
        )}
        {!product.inStock && <span className="product-card__soldout">Sold out</span>}
      </Link>
      <WishlistButton productId={product.id} className="product-card__wish" />

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="eyebrow">{product.collection}</span>
          <ColorDots colors={product.colors} />
        </div>
        <Link to={`/product/${product.slug}`} className="product-card__name">
          {product.name}
        </Link>
        <Price price={product.price} salePrice={product.salePrice} />
      </div>
    </article>
  );
}
