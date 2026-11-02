import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../../components/Icon";
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
const sharedIconNames = { journal: "bag", calendar: "grid", download: "arrowUpRight", plus: "grid", receipt: "bag", refresh: "arrowRight", bankmini: "grid" };
function FinanceIcon({ name, ...props }) { return <Icon name={sharedIconNames[name] || name} {...props}/>; }

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
        <div className="modal-heading"><div><span className="modal-eyebrow">Disbursements Ledger</span><h2 id="expense-form-title">Record Expense</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close"><FinanceIcon name="close" size={19}/></button></div>
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
          <div className="expense-form-actions"><button className="expense-button cancel-button" type="button" onClick={onClose}>Cancel</button><button className="expense-button save-button" type="submit"><FinanceIcon name="check" size={14}/> Save Expense</button></div>
        </form>
      </div>
    </section>
  </div>;
}
export default function ExpensePage({ mode = "list" }) {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState(() => { try { return JSON.parse(localStorage.getItem("ha-finance-expenses")) || seedExpenses; } catch { return seedExpenses; } });
  const [category, setCategory] = useState("All Categories");
  const [period, setPeriod] = useState("Monthly Q2");
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

  const activeCount = filteredExpenses.filter((expense) => expense.status === "Active").length;
  const averageExpense = activeCount ? activeTotal / activeCount : 0;
  const categoryCount = filteredExpenses.filter((expense) => expense.category === "Raw Silk & Fabric" && expense.status === "Active").length;
  const setCategoryFilter = (value) => setCategory(value);
  const exportCsv = () => { const rows = [["Date", "Reference", "Category", "Vendor", "Description", "Method", "Amount (LKR)", "Status"], ...filteredExpenses.map((item) => [item.date, item.reference, item.category, item.vendor, item.description, item.payment, item.amount, item.status])]; const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "expense-journal.csv"; anchor.click(); URL.revokeObjectURL(url); };

  return <div className="expense-content reference-expense-page">
    <div className="reference-heading"><div className="reference-title-block"><div className="reference-eyebrow"><span>Fiscal Q2 2025 Audit</span><i/> IFRS Compliant <b>·</b> Valued in Multi-Currency Reserve</div><h1>Haute Couture<br/><em>Expense Management</em></h1><p>Consolidated disbursements, raw material procurement settlements, and operational atelier outlays across flagship and bespoke private capsules.</p></div><div className="reference-heading-actions"><div className="period-control">{["Weekly", "Monthly Q2", "Drops"].map((value) => <button type="button" className={period === value ? "is-selected" : ""} onClick={() => setPeriod(value)} key={value}>{value}</button>)}</div><button type="button" className="expense-button export-button" onClick={exportCsv}><FinanceIcon name="download" size={14}/> Export CSV</button></div></div>
    {notice && <p className="expense-notice" role="status">{notice}</p>}
    <section className="expense-kpis" aria-label="Expense summary">
      <article className="expense-kpi"><div className="kpi-label">Gross Expenses YTD <FinanceIcon name="receipt" size={15}/></div><strong>Rs. {fmt(activeTotal)} <small>LKR</small></strong><small><i>↗ +8.4%</i> vs Q1 Paris plan</small></article>
      <article className="expense-kpi"><div className="kpi-label">Average Disbursement <FinanceIcon name="lock" size={15}/></div><strong>Rs. {fmt(averageExpense)}</strong><small><i>↗ +3.2%</i> Vendor invoice average</small></article>
      <article className="expense-kpi"><div className="kpi-label">Artisanal Procurement <FinanceIcon name="bag" size={15}/></div><strong>{activeCount ? Math.round(categoryCount / activeCount * 100) : 0}% <small>of total</small></strong><small><b className="kpi-dot"/> Direct atelier craft &amp; silk</small></article>
      <article className="expense-kpi"><div className="kpi-label">Solvency &amp; Treasury <FinanceIcon name="grid" size={15}/></div><strong>Rs. {fmt(activeTotal * 1.12)} <small>LKR</small></strong><small><i className="kpi-dark-pill">99.4% liquid</i> Unleveraged</small></article>
    </section>
    <section className="expense-journal reference-ledger"><div className="reference-ledger-heading"><div><h2>Operational Expense Ledger</h2><p>Verified disbursements under IFRS French Haute Couture Governance</p></div><div className="ledger-actions"><div className="ledger-categories" aria-label="Filter by category">{[["All Categories", "All Categories"], ["Raw Silk & Fabric", "Raw Fabrics"], ["Courier & Logistics", "Artisan Fees"], ["Atelier Rent", "Studio OpEx"]].map(([value, label]) => <button type="button" className={category === value ? "is-selected" : ""} onClick={() => setCategoryFilter(value)} key={label}>{label}</button>)}</div><Link to="/admin/finance/expenses/new" className="expense-button record-button"><FinanceIcon name="plus" size={15}/> Record Expense</Link></div></div><div className="ledger-rule"/>
      <div className="expense-table-wrap"><table className="expense-table reference-table"><thead><tr><th>Date</th><th>Reference / Voucher</th><th>Category</th><th>Vendor / Beneficiary</th><th>Method</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{filteredExpenses.map((expense, index) => <tr key={`${expense.reference}-${index}`}><td className="expense-date">{new Date(`${expense.date}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td><td className="voucher-cell">{expense.reference}</td><td><span className="expense-category-tag">{expense.category}</span></td><td><strong className="vendor-name">{expense.vendor}</strong><small className="expense-reference">{expense.description}</small></td><td className="payment-method">{expense.payment}</td><td className="expense-amount">Rs. {fmt(expense.amount)}</td><td><span className={`expense-status${expense.status === "Voided" ? " is-voided" : ""}`}><i/>{expense.status === "Active" ? "Settled" : "Audited"}</span></td><td><button type="button" className="row-action" aria-label={`More actions for ${expense.reference}`}>⋮</button></td></tr>)}</tbody></table>{filteredExpenses.length === 0 && <div className="expense-empty">No expenses match your filters.</div>}</div><div className="journal-footer"><span>Showing {filteredExpenses.length} of {expenses.length} expense vouchers for Q2 2025</span><div><button type="button" disabled>Previous</button><button type="button" className="page-selected">1</button><button type="button">2</button><button type="button">3</button><button type="button">Next</button></div></div>
    </section>
    <footer className="expense-footer"><span>H&amp;A Atelier · Finance Ledger</span><span>Secure disbursements · LKR (Rs)</span></footer>
    {isForm && <ExpenseForm onSave={saveExpense} onClose={() => navigate("/admin/finance/expenses")}/>}
  </div>;
}
