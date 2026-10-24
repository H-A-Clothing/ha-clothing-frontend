import Icon from "../../../components/Icon";
import { useWishlist } from "../../../context/WishlistContext";

export default function WishlistButton({ productId, className = "" }) {
  const { has, toggle } = useWishlist();
  const saved = has(productId);

  return (
    <button
      type="button"
      className={`wishlist-btn${saved ? " is-saved" : ""} ${className}`}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      onClick={(event) => {
        event.preventDefault();
        toggle(productId);
      }}
    >
      <Icon name="heart" size={16} />
    </button>
  );
}
