import { Link, useLocation } from "react-router-dom";
import Icon from "../../../components/Icon";
import "../finance.css";

const financeNavigation = [
  ["grid", "Dashboard", "/admin/finance"],
  ["lock", "Expense Management", "/admin/finance/expenses"],
  ["lock", "Product Costs", "/admin/finance/product-costs"],
  ["file", "Reports", "/admin/finance/reports"],
  ["menu", "Reconciliation", "/admin/finance/reconciliation"],
  ["settings", "Settings", "/admin/finance/settings"],
];

export default function FinanceNavigation() {
  const { pathname } = useLocation();
  return <nav className="expense-nav">{financeNavigation.map(([icon, label, to]) => {
    const active = pathname === to || (to === "/admin/finance/expenses" && pathname.startsWith(to));
    return <Link to={to} className={`expense-nav-item${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined} key={label}><Icon name={icon} size={16}/><span>{label}</span></Link>;
  })}</nav>;
}
