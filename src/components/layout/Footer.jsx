import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Collection",
    links: [
      { to: "/new-arrivals", label: "New Arrivals" },
      { to: "/shop/dresses", label: "Dresses" },
      { to: "/shop/tops", label: "Tops" },
      { to: "/shop/skirts-trousers", label: "Skirts & Trousers" },
      { to: "/sale", label: "Sale" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { to: "/delivery", label: "Shipping & Delivery" },
      { to: "/returns", label: "Returns & Exchanges" },
      { to: "/size-guide", label: "Size Guide" },
      { to: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "The Atelier",
    links: [
      { to: "/about", label: "Our Story" },
      { to: "/faq", label: "FAQ" },
    ],
  },
];

export default function Footer({ compact = false }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {!compact && (
        <div className="container site-footer__grid">
          <div>
            <div className="logo logo--left">
              <span className="logo__mark">H&amp;A</span>
              <span className="logo__sub">Clothing</span>
            </div>
            <p className="muted site-footer__about">
              Contemporary silhouettes in limited capsules, tailored with care and made to last.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="eyebrow site-footer__heading">{column.title}</h4>
              <ul className="site-footer__links">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div className="container site-footer__bottom">
        <span>© {year} H&amp;A Clothing. All rights reserved.</span>
        <div className="site-footer__legal">
          <Link to="/faq">FAQ</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
