import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../Icon";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const NAV_LINKS = [
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/shop/dresses", label: "Dresses" },
  { to: "/shop/tops", label: "Tops" },
  { to: "/shop/skirts-trousers", label: "Skirts & Trousers" },
  { to: "/sale", label: "Sale" },
];

export function AnnouncementBar() {
  return (
    <div className="announcement">
      Complimentary courier delivery on orders over $150 · Spring capsule now live
    </div>
  );
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="H&A Clothing home">
      <span className="logo__mark">H&amp;A</span>
      <span className="logo__sub">Clothing</span>
    </Link>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="site-header">
      <AnnouncementBar />
      <div className="container site-header__bar">
        <button
          type="button"
          className="icon-btn"
          aria-label="Search"
          onClick={() => setSearchOpen((open) => !open)}
        >
          <Icon name="search" />
        </button>

        <Logo />

        <div className="site-header__actions">
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <Icon name="heart" />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label="Bag">
            <Icon name="bag" />
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </Link>
          <Link to="/account" className="avatar" aria-label="Account">
            H&amp;A
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form className="container site-search" onSubmit={submitSearch}>
          <Icon name="search" size={18} />
          <input
            autoFocus
            className="site-search__input"
            placeholder="Search dresses, linen, knitwear…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" className="icon-btn" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <Icon name="close" size={18} />
          </button>
        </form>
      )}

      <nav className="site-nav" aria-label="Main">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className="site-nav__link">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
