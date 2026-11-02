import { Link, Outlet, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";

const financeNavigation = [
  ["grid", "Dashboard", "/admin/finance"],
  ["lock", "Expense Management", "/admin/finance/expenses"],
  ["lock", "Product Costs", "/admin/finance/product-costs"],
  ["file", "Reports", "/admin/finance/reports"],
  ["menu", "Reconciliation", "/admin/finance/reconciliation"],
  ["settings", "Settings", "/admin/finance/settings"],
];

export default function FinanceLayout() {
  const { pathname } = useLocation();
  return <main className="finance-app">
    <aside className="expense-sidebar">
      <Link to="/admin/finance" className="expense-brand"><div className="expense-logo">H&amp;A</div><div><strong>H&amp;A</strong><small>Haute Lilac Atelier</small></div></Link>
      <button className="atelier-switcher" type="button"><span className="atelier-dot"/> Paris Flagship Atelier <b>V3</b></button>
      <div className="expense-nav-label">Financial Ledger</div>
      <nav className="expense-nav">{financeNavigation.map(([icon, label, to]) => {
        const active = pathname === to || (to === "/admin/finance/expenses" && pathname.startsWith(to));
        return <Link to={to} className={`expense-nav-item${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined} key={label}><Icon name={icon} size={16}/><span>{label}</span></Link>;
      })}</nav>
      <div className="expense-profile"><span className="profile-monogram">ML</span><span className="profile-copy"><strong>M. Laurent</strong><small>Head Curator</small></span><Icon name="logout" size={14}/></div>
    </aside>
    <div className="expense-workspace">
      <header className="expense-topbar"><div className="top-chip"><i/> PROD · NEON DB CONNECTED</div><span className="top-divider"/><div className="top-chip currency-chip">CURRENCY: LKR (Rs)</div><div className="top-cycle"><Icon name="grid" size={13}/> FISCAL Q3 · CURRENT CYCLE <span>⌄</span></div><span className="top-divider"/><div className="top-user"><span><strong>Member 7</strong><small>Finance Admin</small></span><div className="user-avatar">H</div></div></header>
      <Outlet />
    </div>
  </main>;
}

export function FinanceSection({ title }) {
  return <section className="expense-content finance-section-placeholder"><span className="modal-eyebrow">Financial Ledger</span><h1>{title}</h1><p>This finance section is ready to be implemented.</p></section>;
}
