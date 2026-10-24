import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Icon from "../../../components/Icon";
import { getProduct } from "../../../api/catalogue";
import { useCart } from "../../../context/CartContext";
import { useFetch } from "../../../hooks/useFetch";
import ColorDots from "../components/ColorDots";
import Price from "../components/Price";
import ProductGrid from "../components/ProductGrid";
import ProductImage from "../components/ProductImage";
import SizeGuideModal from "../components/SizeGuideModal";
import SizeSelector from "../components/SizeSelector";
import WishlistButton from "../components/WishlistButton";
import "../shop.css";

const LOW_STOCK = 3;

function Accordion({ title, children, defaultOpen = false }) {
  return (
    <details className="accordion" open={defaultOpen}>
      <summary>
        {title}
        <Icon name="chevronDown" size={16} />
      </summary>
      <div className="accordion__body">{children}</div>
    </details>
  );
}

function ProductDetail({ product }) {
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colors[0]?.name);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const selectedStock = product.sizes.find((s) => s.size === size)?.stock ?? 0;

  const addToBag = () => {
    if (!size) {
      setError("Please select a size.");
      return;
    }
    addItem({ productId: product.id, size, color, quantity });
    setError("");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="pdp">
        <div className="pdp__gallery">
          <ProductImage product={product} className="pdp__image" />
          <div className="pdp__thumbs">
            {[0, 1, 2].map((index) => (
              <ProductImage key={index} product={product} className="pdp__thumb" />
            ))}
          </div>
        </div>

        <div className="pdp__info">
          <span className="eyebrow">{product.collection} · {product.categoryLabel}</span>
          <h1 className="pdp__name">{product.name}</h1>
          <Price price={product.price} salePrice={product.salePrice} className="pdp__price" />

          <div className="pdp__option">
            <span className="field-label">
              Colour: <strong>{color}</strong>
            </span>
            <ColorDots colors={product.colors} selected={color} onSelect={setColor} size="lg" />
          </div>

          <div className="pdp__option">
            <div className="pdp__option-head">
              <span className="field-label">Select size</span>
              <button type="button" className="link-underline" onClick={() => setSizeGuideOpen(true)}>
                Size Guide
              </button>
            </div>
            <SizeSelector
              sizes={product.sizes}
              value={size}
              onChange={(value) => {
                setSize(value);
                setQuantity(1);
                setError("");
              }}
            />
            {size && selectedStock <= LOW_STOCK && (
              <p className="pdp__stock">Only {selectedStock} left in this size</p>
            )}
            {!product.inStock && <p className="pdp__stock">This piece is currently sold out.</p>}
          </div>

          <div className="pdp__buy">
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={size && quantity >= selectedStock}
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button type="button" className="btn btn--primary pdp__add" disabled={!product.inStock} onClick={addToBag}>
              <Icon name="bag" size={16} /> {added ? "Added to bag" : "Add to bag"}
            </button>
            <WishlistButton productId={product.id} className="pdp__wish" />
          </div>
          {error && <p className="form-error">{error}</p>}

          <div className="pdp__accordions">
            <Accordion title="Description" defaultOpen>
              <p>{product.description}</p>
            </Accordion>
            <Accordion title="Fabric & Care">
              <p>{product.fabric}</p>
            </Accordion>
            <Accordion title="Delivery & Returns">
              <p>
                Complimentary courier delivery on orders over $150. Returns and exchanges accepted within 14 days
                of delivery. <Link to="/returns" className="link-inline">Read the policy</Link>.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {product.related?.length > 0 && (
        <section className="home-section">
          <div className="section-head">
            <h2>You may also like</h2>
          </div>
          <ProductGrid products={product.related} columns={4} />
        </section>
      )}

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, loading, error } = useFetch(() => getProduct(slug), [slug]);

  return (
    <div className="page container">
      {loading && <div className="pdp pdp--loading" aria-busy="true" />}
      {error && (
        <div className="empty-state">
          <h3>We couldn't find this piece</h3>
          <Link to="/shop" className="btn btn--primary">
            Back to the collection
          </Link>
        </div>
      )}
      {product && (
        <>
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: product.categoryLabel, to: `/shop/${product.category}` },
              { label: product.name },
            ]}
          />
          <ProductDetail key={product.id} product={product} />
        </>
      )}
    </div>
  );
}
