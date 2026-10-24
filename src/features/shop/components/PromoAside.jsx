import { Link } from "react-router-dom";

export default function PromoAside() {
  return (
    <aside className="promo-aside">
      <span className="eyebrow">Atelier Service</span>
      <h3>Personal Styling</h3>
      <p>Complimentary styling advice and fit consultations with our studio team.</p>
      <Link to="/contact" className="link-underline">
        Book a session →
      </Link>
    </aside>
  );
}
