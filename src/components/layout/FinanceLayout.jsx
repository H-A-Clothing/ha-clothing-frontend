import { Link, Outlet } from "react-router-dom";
import Icon from "../Icon";
import FinanceNavigation from "../../features/finance/components/FinanceNavigation";

export default function FinanceLayout() {
  return <main className="finance-app">
    <aside className="expense-sidebar">
      <Link to="/admin/finance" className="expense-brand"><div className="expense-logo">H&amp;A</div><div><strong>H&amp;A</strong><small>Haute Lilac Atelier</small></div></Link>
      <div className="atelier-switcher"><span className="atelier-dot"/> H&amp;A Clothing <b>HQ</b></div>
      <div className="expense-nav-label">Financial Ledger</div>
      <FinanceNavigation />
      <div className="expense-profile"><span className="profile-monogram">ML</span><span className="profile-copy"><strong>M. Laurent</strong><small>Head Curator</small></span><Icon name="logout" size={14}/></div>
    </aside>
    <div className="expense-workspace">
      <header className="expense-topbar"><div className="top-crumb"><span>H&amp;A BACK-OFFICE</span><b>/</b><strong>FINANCE CONSOLE</strong><em>H&amp;A CLOTHING</em></div><div className="top-cycle"><Icon name="grid" size={13}/> FISCAL Q4 · 2026 <span>⌄</span></div><span className="top-divider"/><div className="top-user"><span><strong>Finance Admin</strong><small>Member 7</small></span><div className="user-avatar">HA</div></div></header>
      <Outlet />
    </div>
  </main>;
}
