// Layout for the checkout and payment flow (shared by Members 1 and 2).
import { Link, Outlet } from "react-router-dom";
import Icon from "../Icon";
import Footer from "./Footer";
import { AnnouncementBar, Logo } from "./Header";
import { ScrollToTop } from "./SiteLayout";
import "./layout.css";

export const CHECKOUT_STEPS = ["Bag", "Details", "Payment", "Confirmation"];

// `current` is the 1-based index of the active step.
export function CheckoutSteps({ current, failed = false }) {
  return (
    <ol className="checkout-steps">
      {CHECKOUT_STEPS.map((label, index) => {
        const step = index + 1;
        const state = step < current ? "done" : step === current ? "active" : "todo";
        return (
          <li key={label} className={`checkout-steps__item is-${state}`}>
            <span className="checkout-steps__num">
              {state === "done" ? <Icon name="check" size={12} strokeWidth={2} /> : step}
            </span>
            {label}
            {state === "active" && failed && <span className="tag">Unsuccessful</span>}
          </li>
        );
      })}
    </ol>
  );
}

export default function CheckoutLayout() {
  return (
    <>
      <ScrollToTop />
      <header className="site-header">
        <AnnouncementBar />
        <div className="container site-header__bar">
          <nav className="checkout-header__links">
            <Link to="/shop">Collections</Link>
            <Link to="/contact">Client Services</Link>
          </nav>
          <Logo />
          <div className="site-header__actions">
            <span className="checkout-header__secure">
              <Icon name="lock" size={16} /> Encrypted Checkout
            </span>
          </div>
        </div>
      </header>
      <main className="checkout-main">
        <Outlet />
      </main>
      <Footer compact />
    </>
  );
}
