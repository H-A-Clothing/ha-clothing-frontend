import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../../components/Icon";
import "../finance.css";

const seedExpenses = [
  { date: "2026-11-24", category: "Product purchases", description: "New arrivals: tops and frocks", reference: "EXP-2026-1141", vendor: "Colombo Wholesale Market", payment: "Bank transfer", amount: 148500, status: "Active" },
  { date: "2026-11-20", category: "Marketing", description: "Instagram product promotion", reference: "EXP-2026-1138", vendor: "Meta Ads", payment: "Card", amount: 35000, status: "Active" },
  { date: "2026-11-17", category: "Transport", description: "Collection and stock transport", reference: "EXP-2026-1125", vendor: "Local transport", payment: "Cash", amount: 12500, status: "Active" },
  { date: "2026-11-12", category: "Packaging", description: "Customer order packaging", reference: "EXP-2026-1119", vendor: "Pack & Post Lanka", payment: "Bank transfer", amount: 8400, status: "Active" },
  { date: "2026-10-29", category: "Marketing", description: "Facebook page promotion", reference: "EXP-2026-1074", vendor: "Meta Ads", payment: "Card", amount: 21000, status: "Voided" },
];

const categoryGroups = [
  ["All categories", null],
  ["Product purchases", "Product purchases"],
  ["Marketing", "Marketing"],
  ["Operations", "Operations"],
];
const operationCategories = ["Transport", "Packaging", "Rent", "Utilities", "Other"];
const fmt = (amount) => new Intl.NumberFormat("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
const inSelectedPeriod = (date, period) => {
  if (period === "Weekly") return date >= "2026-11-23" && date <= "2026-11-29";
  if (period === "Monthly") return date.startsWith("2026-11");
  return date >= "2026-10-01" && date <= "2026-12-31";
};

function ExpenseForm({ onSave, onClose }) {
  const [form, setForm] = useState({ category: "Product purchases", date: new Date().toISOString().slice(0, 10), description: "", amount: "", payment: "Bank transfer", reference: "", notes: "" });
  const [error, setError] = useState("");
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.description.trim() || !form.reference.trim() || Number(form.amount) <= 0) {
      setError("Enter a description, reference number, and an amount greater than zero.");
      return;
    }
    onSave({ ...form, vendor: form.vendor || form.description, amount: Number(form.amount), status: "Active" });
  };

  return <div className="expense-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="expense-modal" role="dialog" aria-modal="true" aria-labelledby="expense-form-title">
      <div className="modal-accent"/><div className="expense-modal-inner">
        <div className="modal-heading"><div><span className="modal-eyebrow">H&amp;A financial ledger</span><h2 id="expense-form-title">Record expense</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close"><Icon name="close" size={19}/></button></div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="expense-field"><span>Category <b>*</b></span><select name="category" value={form.category} onChange={update}>{["Product purchases", "Marketing", ...operationCategories].map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="expense-field"><span>Date <b>*</b></span><input name="date" type="date" value={form.date} onChange={update} required/></label>
            <label className="expense-field field-full"><span>Description <b>*</b></span><input name="description" value={form.description} onChange={update} required placeholder="What was this expense for?"/></label>
            <label className="expense-field"><span>Amount (LKR) <b>*</b></span><div className="amount-input"><span>Rs.</span><input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={update} required placeholder="0.00"/></div></label>
            <label className="expense-field"><span>Payment method <b>*</b></span><select name="payment" value={form.payment} onChange={update}>{["Bank transfer", "Cash", "Card", "Cheque"].map((method) => <option key={method}>{method}</option>)}</select></label>
            <label className="expense-field field-full"><span>Reference / invoice number <b>*</b></span><input name="reference" value={form.reference} onChange={update} required placeholder="e.g. INV-2026-001"/></label>
            <label className="expense-field field-full"><span>Notes</span><textarea name="notes" value={form.notes} onChange={update} placeholder="Optional details"/></label>
          </div>
          {error && <p className="expense-form-error" role="alert">{error}</p>}
          <div className="expense-form-actions"><button className="expense-button cancel-button" type="button" onClick={onClose}>Cancel</button><button className="expense-button save-button" type="submit"><Icon name="check" size={14}/> Save expense</button></div>
        </form>
      </div>
    </section>
  </div>;
}

export default function ExpensePage({ mode = "list" }) {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState(() => { try { return JSON.parse(localStorage.getItem("ha-finance-expenses-v2")) || seedExpenses; } catch { return seedExpenses; } });
  const [category, setCategory] = useState(null);
  const [period, setPeriod] = useState("Monthly");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const isForm = mode === "new";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = isForm ? "Record Expense | H&A Finance" : "Expense Management | H&A Finance";
    return () => { document.title = previousTitle; };
  }, [isForm]);

  const filteredExpenses = useMemo(() => expenses.filter((expense) => {
    const matchesCategory = !category || (category === "Operations" ? operationCategories.includes(expense.category) : expense.category === category);
    const matchesPeriod = inSelectedPeriod(expense.date, period);
    const matchesQuery = !query || `${expense.description} ${expense.vendor} ${expense.reference} ${expense.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesPeriod && matchesQuery;
  }), [expenses, category, period, query]);
  const activeExpenses = filteredExpenses.filter((expense) => expense.status === "Active");
  const activeTotal = activeExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const averageExpense = activeExpenses.length ? activeTotal / activeExpenses.length : 0;
  const purchasesTotal = activeExpenses.filter((expense) => expense.category === "Product purchases").reduce((sum, expense) => sum + Number(expense.amount), 0);
  const purchaseShare = activeTotal ? Math.round(purchasesTotal / activeTotal * 100) : 0;
  const voidedCount = filteredExpenses.filter((expense) => expense.status === "Voided").length;

  const saveExpense = (expense) => {
    const updated = [expense, ...expenses];
    setExpenses(updated);
    try { localStorage.setItem("ha-finance-expenses-v2", JSON.stringify(updated)); } catch { /* The current view still updates if storage is unavailable. */ }
    setNotice("Expense recorded successfully.");
    navigate("/admin/finance/expenses");
  };

  const exportCsv = () => {
    const rows = [["Date", "Reference", "Category", "Vendor", "Description", "Method", "Amount (LKR)", "Status"], ...filteredExpenses.map((item) => [item.date, item.reference, item.category, item.vendor, item.description, item.payment, item.amount, item.status])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "ha-expense-ledger.csv"; anchor.click(); URL.revokeObjectURL(url);
  };

  return <div className="expense-content reference-expense-page">
    <div className="reference-heading">
      <div className="reference-title-block">
        <div className="reference-eyebrow"><span>H&amp;A · Finance</span><i/> Expense ledger <b>·</b> LKR
        </div>
        <h1>Expense <em>Management</em></h1>
        <p>Track product purchases, marketing, and day-to-day operating expenses in one place.</p>
      </div>
      <div className="reference-heading-actions">
        <div className="period-control" aria-label="Filter expenses by period">{["Weekly", "Monthly", "Quarterly"].map((value) => <button type="button" aria-pressed={period === value} className={period === value ? "is-selected" : ""} onClick={() => setPeriod(value)} key={value}>{value === "Quarterly" ? "Q4 2026" : value}</button>)}</div>
        <button type="button" className="expense-button export-button" onClick={exportCsv}><Icon name="arrowUpRight" size={14}/> Export CSV</button>
      </div>
    </div>
    {notice && <p className="expense-notice" role="status">{notice}</p>}
    <section className="expense-kpis" aria-label="Expense summary">
      <article className="expense-kpi"><div className="kpi-label">Total expenses <Icon name="bag" size={15}/></div><strong>Rs. {fmt(activeTotal)} <small>LKR</small></strong><small><i>{period === "Quarterly" ? "Q4 2026" : period}</i> Active expenses</small></article>
      <article className="expense-kpi"><div className="kpi-label">Average expense <Icon name="file" size={15}/></div><strong>Rs. {fmt(averageExpense)}</strong><small><i>{activeExpenses.length} records</i> In this period</small></article>
      <article className="expense-kpi"><div className="kpi-label">Product purchases <Icon name="bag" size={15}/></div><strong>{purchaseShare}% <small>of total</small></strong><small><b className="kpi-dot"/> Stock and product sourcing</small></article>
      <article className="expense-kpi"><div className="kpi-label">Ledger status <Icon name="shield" size={15}/></div><strong>{filteredExpenses.length} <small>records</small></strong><small><i className="kpi-dark-pill">{voidedCount} voided</i> Retained for audit</small></article>
    </section>
    <section className="expense-journal reference-ledger">
      <div className="reference-ledger-heading">
        <div><h2>Expense ledger</h2><p>Recorded business expenses for the selected period</p></div>
        <div className="ledger-actions">
          <div className="ledger-categories" aria-label="Filter by category">{categoryGroups.map(([value, label]) => <button type="button" aria-pressed={(category || "All categories") === (value || "All categories")} className={(category || "All categories") === (value || "All categories") ? "is-selected" : ""} onClick={() => setCategory(value)} key={label || value}>{value || label}</button>)}</div>
          <Link to="/admin/finance/expenses/new" className="expense-button record-button"><Icon name="plus" size={15}/> Record expense</Link>
        </div>
      </div>
      <div className="ledger-tools"><label className="ledger-search"><Icon name="search" size={15}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reference, vendor, or category" aria-label="Search expenses"/></label><span>{period === "Quarterly" ? "1 Oct – 31 Dec 2026" : period === "Monthly" ? "November 2026" : "23 – 29 Nov 2026"}</span></div>
      <div className="ledger-rule"/>
      <div className="expense-table-wrap"><table className="expense-table reference-table"><thead><tr><th>Date</th><th>Reference / voucher</th><th>Category</th><th>Vendor / beneficiary</th><th>Method</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{filteredExpenses.map((expense) => <tr key={expense.reference}>
        <td className="expense-date">{new Date(`${expense.date}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
        <td className="voucher-cell">{expense.reference}</td><td><span className="expense-category-tag">{expense.category}</span></td>
        <td><strong className="vendor-name">{expense.vendor}</strong><small className="expense-reference">{expense.description}</small></td>
        <td className="payment-method">{expense.payment}</td><td className="expense-amount">Rs. {fmt(expense.amount)}</td>
        <td><span className={`expense-status${expense.status === "Voided" ? " is-voided" : ""}`}><i/>{expense.status}</span></td>
        <td><button type="button" className="row-action" aria-label={`View ${expense.reference} details`} title="View expense details" onClick={() => setSelectedExpense(expense)}>⋮</button></td>
      </tr>)}</tbody></table>{filteredExpenses.length === 0 && <div className="expense-empty">No expenses match these filters.</div>}</div>
      <div className="journal-footer"><span>Showing {filteredExpenses.length} of {expenses.length} expense records · {period === "Quarterly" ? "Q4 2026" : period}</span><span className="ledger-voided-note">{voidedCount} voided record{voidedCount === 1 ? "" : "s"} retained in the ledger</span></div>
    </section>
    <footer className="expense-footer"><span>H&amp;A Clothing · Finance</span><span>Amounts shown in Sri Lankan rupees (LKR)</span></footer>
    {isForm && <ExpenseForm onSave={saveExpense} onClose={() => navigate("/admin/finance/expenses")}/>}
    {selectedExpense && <div className="expense-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedExpense(null); }}><section className="expense-modal expense-detail-modal" role="dialog" aria-modal="true" aria-labelledby="expense-detail-title"><div className="modal-accent"/><div className="expense-modal-inner"><div className="modal-heading"><div><span className="modal-eyebrow">Expense details</span><h2 id="expense-detail-title">{selectedExpense.reference}</h2></div><button className="icon-button" type="button" onClick={() => setSelectedExpense(null)} aria-label="Close"><Icon name="close" size={19}/></button></div><dl className="expense-detail-grid"><div><dt>Date</dt><dd>{new Date(`${selectedExpense.date}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</dd></div><div><dt>Category</dt><dd>{selectedExpense.category}</dd></div><div><dt>Vendor / beneficiary</dt><dd>{selectedExpense.vendor}</dd></div><div><dt>Payment method</dt><dd>{selectedExpense.payment}</dd></div><div><dt>Amount</dt><dd>Rs. {fmt(selectedExpense.amount)} LKR</dd></div><div><dt>Status</dt><dd>{selectedExpense.status}</dd></div><div className="detail-full"><dt>Description</dt><dd>{selectedExpense.description}</dd></div></dl></div></section></div>}
  </div>;
}
