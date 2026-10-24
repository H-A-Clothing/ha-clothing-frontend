// One line in the shopping bag.
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/formatters";
import ProductImage from "../../shop/components/ProductImage";
import "../../shop/shop.css"; // reuses Member 1's .qty stepper and .product-image styles

export default function CartItem({ line, onChangeQuantity, onRemove }) {
  const { product, size, color, quantity, unitPrice, lineTotal, maxQuantity } = line;
  const productUrl = `/product/${product.slug}`;

  return (
    <article className="cart-item card">
      <Link to={productUrl} className="cart-item__media">
        <ProductImage product={product} />
      </Link>

      <div className="cart-item__body">
        <div className="cart-item__top">
          <div>
            <span className="eyebrow">{product.collection}</span>
            <Link to={productUrl} className="cart-item__name">
              {product.name}
            </Link>
            <p className="cart-item__meta muted">
              Colour: {color} · Size: {size} · {formatPrice(unitPrice)} each
            </p>
          </div>
          <strong className="cart-item__total">{formatPrice(lineTotal)}</strong>
        </div>

        <div className="cart-item__bottom">
          <div className="qty">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => onChangeQuantity(quantity - 1)}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= maxQuantity}
              onClick={() => onChangeQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button type="button" className="link-underline" onClick={onRemove}>
            Remove
          </button>
        </div>

        {quantity > maxQuantity && (
          <p className="form-error">Only {maxQuantity} left in this size. Please lower the quantity.</p>
        )}
      </div>
    </article>
  );
}