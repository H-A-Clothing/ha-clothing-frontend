// Shopping bag page (Member 2).
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Icon from "../../../components/Icon";
import { getCartSummary } from "../../../api/checkout";
import { useCart } from "../../../context/CartContext";
import { useFetch } from "../../../hooks/useFetch";
import { pluralize } from "../../../utils/formatters";
import CartItem from "../components/CartItem";
import "../checkout.css";

export default function CartPage() {
  const { items, itemCount, updateQuantity, removeItem } = useCart();

  // Re-run whenever the cart changes. JSON.stringify turns the array into text so React can compare it.
  const { data: summary, error } = useFetch(() => getCartSummary(items), [JSON.stringify(items)]);

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <Icon name="bag" size={32} />
          <h3>Your bag is empty</h3>
          <p className="muted">Pieces you add will appear here.</p>
          <Link to="/shop" className="btn btn--primary">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Bag" }]} />

      <div className="cart-head">
        <h1 className="page-title">
          Your Shopping <em>Bag</em>
        </h1>
        <span className="tag">{pluralize(itemCount, "item")}</span>
      </div>

      {error && <p className="form-error">We couldn't load your bag. Please refresh the page.</p>}

      <div className="cart-lines">
        {summary?.lines.map((line) => (
          <CartItem
            key={`${line.productId}-${line.size}-${line.color}`}
            line={line}
            onChangeQuantity={(quantity) => updateQuantity(line, quantity)}
            onRemove={() => removeItem(line)}
          />
        ))}
      </div>
    </div>
  );
}