import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../finance.css";

const seedExpenses = [
  { date: "2026-02-27", category: "Raw Silk & Fabric", description: "Crepe de Chine Mulberry Bolts (120m)", reference: "PO-COLOMBO-9821", vendor: "Lanka Silk Weavers", payment: "Bank Transfer", amount: 465000, status: "Active" },
  { date: "2026-02-25", category: "Atelier Rent", description: "Horton Place Showroom & Cutting Suite Lease", reference: "LEASE-01-2026", vendor: "Cinnamon Gardens RE", payment: "Bank Transfer", amount: 620000, status: "Active" },
  { date: "2026-02-23", category: "Courier & Logistics", description: "International sample dispatch", reference: "BT-2026-NATIONS-882", vendor: "Colombo Express", payment: "Petty Cash", amount: 385000, status: "Active" },
  { date: "2026-02-20", category: "Software & Subscriptions", description: "Annual design suite subscription", reference: "INV-SOFT-2026-08", vendor: "Atelier Cloud", payment: "Card", amount: 372500, status: "Active" },
  { date: "2026-02-16", category: "Raw Silk & Fabric", description: "Spring collection fabric procurement", reference: "FAB-2026-102", vendor: "Lanka Silk Weavers", payment: "Bank Transfer", amount: 0, status: "Voided" },
];

const categories = ["All Categories", "Raw Silk & Fabric", "Atelier Rent", "Courier & Logistics", "Software & Subscriptions"];
const fmt = (amount) => new Intl.NumberFormat("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
const displayDate = (value) => { const [year, month, day] = value.split("-"); return `${year}-${month}-${day}`; };

function Icon({ name, size = 16 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    journal: <><path d="M5 3h14v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 7h9M7 11h9M7 15h6M8 3v18"/></>,
    box: <><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 8h16M9 12h6M9 16h6"/></>,
    chart: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 16v-4M12 16V8M16 16v-6"/></>,
    bank: <><path d="m3 9 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M2 18h20"/></>,
    settings: <><path d="M4 6h16M4 12h16M4 18h16M8 4v4M15 10v4M11 16v4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    download: <><path d="M12 3v11m0 0 4-4m-4 4-4-4M4 18v3h16v-3"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    receipt: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2zM8 8h8M8 12h8M8 16h5"/></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></>,
    bankmini: <><path d="m3 9 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Sidebar() {
  const nav = [["grid", "Dashboard", false], ["journal", "Expense Management", true], ["box", "Product Costs", false], ["chart", "Reports", false], ["bank", "Reconciliation", false], ["settings", "Settings", false]];
  return <aside className="expense-sidebar">
    <div className="expense-brand"><div className="expense-logo">H<span>&amp;A</span></div><div><strong>H&amp;A Atelier</strong><small>Finance Back-Office</small></div></div>
    <div className="expense-nav-label">Financial Ledger</div>
    <nav className="expense-nav">{nav.map(([icon, label, active]) => <div className={`expense-nav-item${active ? " is-active" : ""}`} key={label}><Icon name={icon}/><span>{label}</span></div>)}</nav>
    <div className="expense-ledger"><span>Ledger Base</span><strong>LKR (Rs)</strong><Icon name="lock" size={13}/></div>
  </aside>;
}

function Topbar() {
  return <header className="expense-topbar"><div className="top-chip"><i/> PROD · NEON DB CONNECTED</div><span className="top-divider"/><div className="top-chip currency-chip">CURRENCY: LKR (Rs)</div><div className="top-cycle"><Icon name="calendar" size={13}/> FISCAL Q3 · CURRENT CYCLE <span>⌄</span></div><span className="top-divider"/><div className="top-user"><span><strong>Member 7</strong><small>Finance Admin</small></span><div className="user-avatar">H</div></div></header>;
}

function ExpenseForm({ onSave, onClose }) {
  const [form, setForm] = useState({ category: "Courier & Logistics", date: "2026-02-28", description: "Mulberry Silk Organza Bolts - Colombo Handloom Weavers", amount: "385000.00", payment: "Petty Cash", reference: "BT-2026-NATIONS-882", notes: "Approved for Spring 2026 Couture collection fabric procurement." });
  const [error, setError] = useState("");
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.description.trim() || !form.reference.trim() || Number(form.amount) <= 0) { setError("Enter a description, reference number, and an amount greater than zero."); return; }
    onSave({ ...form, amount: Number(form.amount), date: form.date, status: "Active" });
  };
  return <div className="expense-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="expense-modal" role="dialog" aria-modal="true" aria-labelledby="expense-form-title">
      <div className="modal-accent"/><div className="expense-modal-inner">
        <div className="modal-heading"><div><span className="modal-eyebrow">Disbursements Ledger</span><h2 id="expense-form-title">Record Expense</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close"><Icon name="close" size={19}/></button></div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="expense-field"><span>Expense Category <b>*</b></span><select name="category" value={form.category} onChange={update}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="expense-field"><span>Date <b>*</b></span><input name="date" type="date" value={form.date} onChange={update} required/></label>
            <label className="expense-field field-full"><span>Description / Vendor <b>*</b></span><input name="description" value={form.description} onChange={update} required/></label>
            <label className="expense-field"><span>Amount (LKR) <b>*</b></span><div className="amount-input"><span>Rs.</span><input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={update} required/></div></label>
            <label className="expense-field"><span>Payment Method <b>*</b></span><select name="payment" value={form.payment} onChange={update}>{["Petty Cash", "Bank Transfer", "Card", "Cheque"].map((method) => <option key={method}>{method}</option>)}</select></label>
            <label className="expense-field field-full"><span>Reference / Invoice No. <b>*</b></span><input name="reference" value={form.reference} onChange={update} required/></label>
            <label className="expense-field field-full"><span>Notes / Remarks</span><textarea name="notes" value={form.notes} onChange={update}/></label>
          </div>
          {error && <p className="expense-form-error" role="alert">{error}</p>}
          <div className="expense-form-actions"><button className="expense-button cancel-button" type="button" onClick={onClose}>Cancel</button><button className="expense-button save-button" type="submit"><Icon name="check" size={14}/> Save Expense</button></div>
        </form>
      </div>
    </section>
  </div>;
}

export default function ExpensePage({ mode = "list" }) {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState(() => { try { return JSON.parse(localStorage.getItem("ha-finance-expenses")) || seedExpenses; } catch { return seedExpenses; } });
  const [category, setCategory] = useState("All Categories");
  const [period, setPeriod] = useState("This Month");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const isForm = mode === "new";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = isForm ? "Record Expense | H&A Atelier Finance" : "Expense Management | H&A Atelier Finance";
    return () => { document.title = previousTitle; };
  }, [isForm]);

  const filteredExpenses = useMemo(() => expenses.filter((expense) => {
    const matchesCategory = category === "All Categories" || expense.category === category;
    const matchesStatus = status === "All" || expense.status === status;
    const matchesQuery = !query || `${expense.description} ${expense.vendor} ${expense.reference} ${expense.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesStatus && matchesQuery;
  }), [expenses, category, status, query]);
  const activeTotal = filteredExpenses.filter((expense) => expense.status === "Active").reduce((sum, expense) => sum + expense.amount, 0);
  const voidedCount = filteredExpenses.filter((expense) => expense.status === "Voided").length;

  const saveExpense = (expense) => {
    const updated = [expense, ...expenses];
    setExpenses(updated);
    try { localStorage.setItem("ha-finance-expenses", JSON.stringify(updated)); } catch { /* Current view still updates if storage is unavailable. */ }
    setNotice("Expense recorded successfully.");
    navigate("/admin/finance/expenses");
  };

  return <main className="finance-app"><Sidebar/><div className="expense-workspace"><Topbar/><div className="expense-content">
    <div className="expense-page-heading"><div><h1>Expense Management</h1><p>Track, review, and record company operational expenditures</p></div><div className="expense-heading-actions"><button type="button" className="expense-button export-button" onClick={() => { const rows = [["Date", "Category", "Description", "Vendor", "Payment", "Amount (LKR)", "Status"], ...filteredExpenses.map((item) => [item.date, item.category, item.description, item.vendor, item.payment, item.amount, item.status])]; const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "expense-journal.csv"; anchor.click(); URL.revokeObjectURL(url); }}><Icon name="download" size={13}/> Export CSV</button><Link to="/admin/finance/expenses/new" className="expense-button record-button"><Icon name="plus" size={15}/> Record Expense</Link></div></div>
    {notice && <p className="expense-notice" role="status">{notice}</p>}
    <section className="expense-filters" aria-label="Filter expenses"><div className="filter-top-row"><div className="filter-group"><span className="filter-label">Date Range:</span>{["This Month", "Last Month", "Last 30 Days"].map((value) => <button type="button" key={value} className={`filter-chip${period === value ? " selected" : ""}`} onClick={() => setPeriod(value)}>{value}</button>)}<div className="date-range"><Icon name="calendar" size={13}/><input aria-label="Start date" type="date" defaultValue="2026-02-01"/><span>–</span><input aria-label="End date" type="date" defaultValue="2026-02-28"/></div></div><div className="filter-group status-filter"><span className="filter-label">Status:</span>{[["All", "24"], ["Active", "22"], ["Voided", "2"]].map(([value, count]) => <button type="button" key={value} className={`status-chip${status === value ? " selected" : ""}`} onClick={() => setStatus(value)}>{value}<small>({count})</small></button>)}</div></div><div className="category-row"><span className="filter-label">Category:</span>{categories.map((value) => <button type="button" key={value} className={`category-chip${category === value ? " selected" : ""}`} onClick={() => setCategory(value)}>{value}</button>)}</div></section>
    <section className="expense-total"><div><span className="total-caption">Total Filtered Expenses</span><div className="total-value">Rs. {fmt(activeTotal)} <small>({filteredExpenses.filter((expense) => expense.status === "Active").length} items active)</small></div></div><div className="total-voided">{voidedCount} voided items excluded</div><div className="total-icon"><Icon name="receipt" size={18}/></div></section>
    <section className="expense-journal"><div className="journal-heading"><div><h2>Expense Journal</h2><span className="quarter-tag">Fiscal Q3</span></div><label className="journal-search"><span className="visually-hidden">Search expenses</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="⌕ Search expenses"/></label><span className="updated-label"><Icon name="refresh" size={12}/> Updated recently</span></div>
      <div className="expense-table-wrap"><table className="expense-table"><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Payment<br/>Method</th><th>Amount (LKR)</th><th>Status</th></tr></thead><tbody>{filteredExpenses.map((expense, index) => <tr key={`${expense.reference}-${index}`}><td className="expense-date">{displayDate(expense.date)}</td><td><span className="expense-category-tag">{expense.category}</span></td><td><div className="expense-description">{expense.description}</div><small className="expense-reference">Ref: {expense.reference} · Vendor: {expense.vendor}</small></td><td><span className="payment-method"><Icon name="bankmini" size={13}/>{expense.payment}</span></td><td className="expense-amount">{fmt(expense.amount)}</td><td><span className={`expense-status${expense.status === "Voided" ? " is-voided" : ""}`}><i/>{expense.status}</span></td></tr>)}</tbody></table>{filteredExpenses.length === 0 && <div className="expense-empty">No expenses match your filters.</div>}</div><div className="journal-footer">Showing {filteredExpenses.length} of {expenses.length} expenses <div><button type="button" disabled>← Previous</button><button type="button" className="page-selected">1</button><button type="button">Next →</button></div></div>
    </section>
    <footer className="expense-footer"><span>H&amp;A Atelier · Finance Ledger</span><span>Secure disbursements · LKR (Rs)</span></footer>
    </div></div>{isForm && <ExpenseForm onSave={saveExpense} onClose={() => navigate("/admin/finance/expenses")}/>}</main>;
}
