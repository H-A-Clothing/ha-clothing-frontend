import { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Icon from "../../../components/Icon";
import { getWishlistProducts } from "../../../api/catalogue";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useFetch } from "../../../hooks/useFetch";
import ColorDots from "../components/ColorDots";
import Price from "../components/Price";
import ProductImage from "../components/ProductImage";
import SizeSelector from "../components/SizeSelector";
import SizeGuideModal from "../components/SizeGuideModal";
import "../shop.css";

function WishlistCard({ product, onMove, onRemove, onOpenSizeGuide }) {
  const [color, setColor] = useState(product.colors[0]?.name);
  const [size, setSize] = useState(null);
  const [error, setError] = useState(false);
  const lowStock = product.stock > 0 && product.stock <= 3;

  const move = () => {
    if (!size) {
      setError(true);
      return;
    }
    onMove({ productId: product.id, size, color });
  };

  return (
    <article className="wish-card card">
      <div className="wish-card__media">
        <Link to={`/product/${product.slug}`}>
          <ProductImage product={product} />
        </Link>
        {lowStock ? (
          <span className="tag product-card__badge">Low stock · {product.stock} left</span>
        ) : (
          product.badge && <span className="tag product-card__badge">{product.badge}</span>
        )}
        <button type="button" className="wish-card__remove" aria-label="Remove from wishlist" onClick={onRemove}>
          <Icon name="close" size={14} />
        </button>
      </div>

      <div className="wish-card__body">
        <span className="eyebrow">{product.categoryLabel}</span>
        <Link to={`/product/${product.slug}`} className="wish-card__name">
          {product.name}
        </Link>
        <Price price={product.price} salePrice={product.salePrice} />

        <div className="wish-card__row">
          <span className="field-label">
            Colour: <strong>{color}</strong>
          </span>
          <ColorDots colors={product.colors} selected={color} onSelect={setColor} />
        </div>

        <div className="wish-card__row">
          <span className="field-label">Select size</span>
          <button type="button" className="link-underline" onClick={onOpenSizeGuide}>
            Guide
          </button>
        </div>
        <SizeSelector
          compact
          sizes={product.sizes}
          value={size}
          onChange={(value) => {
            setSize(value);
            setError(false);
          }}
        />
        {error && <p className="form-error">Select a size first.</p>}

        <button type="button" className="btn btn--primary btn--block" disabled={!product.inStock} onClick={move}>
          <Icon name="bag" size={16} /> {product.inStock ? "Move to bag" : "Sold out"}
        </button>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const { ids, remove, clear } = useWishlist();
  const { addItem } = useCart();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { data: products, loading } = useFetch(() => getWishlistProducts(ids), [ids.join(",")]);

  const moveToBag = (item) => {
    addItem(item);
    remove(item.productId);
  };

  const visible = (products ?? []).filter((product) => ids.includes(product.id));

  return (
    <div className="page container">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
      <div className="wishlist-head">
        <div>
          <div className="catalogue-header__title">
            <h1 className="page-title">
              Saved <em>Pieces</em>
            </h1>
            <span className="tag">{ids.length} pieces</span>
          </div>
          <p className="muted">Your personal curation. Choose a size and move pieces straight into your bag.</p>
        </div>
        {ids.length > 0 && (
          <button type="button" className="link-underline" onClick={clear}>
            Clear all
          </button>
        )}
      </div>

      {loading && !products && ids.length > 0 && (
        <div className="product-grid product-grid--4" aria-busy="true">
          {ids.map((id) => (
            <div key={id} className="product-card product-card--skeleton" />
          ))}
        </div>
      )}

      {visible.length > 0 && (
        <div className="product-grid product-grid--4 wish-grid">
          {visible.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              onMove={moveToBag}
              onRemove={() => remove(product.id)}
              onOpenSizeGuide={() => setSizeGuideOpen(true)}
            />
          ))}
        </div>
      )}

      {ids.length === 0 && (
        <div className="empty-state">
          <Icon name="heart" size={32} />
          <h3>Your wishlist is empty</h3>
          <p className="muted">Tap the heart on any piece to save it here.</p>
          <Link to="/shop" className="btn btn--primary">
            Start shopping
          </Link>
        </div>
      )}

      <div className="info-strip card">
        <span className="info-strip__icon">
          <Icon name="gift" size={18} />
        </span>
        <p>
          <strong>Atelier privileges:</strong> complimentary gift packaging is available on all wishlist orders at
          checkout.
        </p>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
