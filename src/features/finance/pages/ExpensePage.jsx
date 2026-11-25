import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";
import { listExpenses, listExpenseCategories } from "../../../api/finance";

function localDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-LK", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function dateRange(period) {
  const today = new Date();
  const to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let from;
  if (period === "Weekly") {
    from = new Date(to);
    from.setDate(from.getDate() - ((from.getDay() + 6) % 7));
  } else if (period === "Quarterly") {
    from = new Date(to.getFullYear(), Math.floor(to.getMonth() / 3) * 3, 1);
  } else {
    from = new Date(to.getFullYear(), to.getMonth(), 1);
  }
  const asInputDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return { from: asInputDate(from), to: asInputDate(to) };
}

const standardCategoryFilters = [
  { label: "Marketing", names: ["marketing"] },
  { label: "Product Purchase", names: ["product purchase", "product purchases"] },
  { label: "Packaging", names: ["packaging"] },
  { label: "Other", names: ["other"] },
  { label: "Rent", names: ["rent"] },
  { label: "Transport", names: ["transport"] },
  { label: "Utilities", names: ["utilities"] },
];
const standardCategoryNames = new Set(standardCategoryFilters.flatMap(({ names }) => names));

export default function ExpensePage() {
  const [period, setPeriod] = useState("Monthly");
  const [categoryId, setCategoryId] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({ data: [], meta: { total: 0, totalAmount: 0 } });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const categoryNamed = (names) => categories.find((category) => names.includes(category.name.trim().toLowerCase()));
  const categoryFilters = standardCategoryFilters.map(({ label, names }) => ({ label, category: categoryNamed(names) }));
  const customCategories = categories.filter((category) => !standardCategoryNames.has(category.name.trim().toLowerCase()));

  const range = useMemo(() => dateRange(period), [period]);
  useEffect(() => {
    let current = true;
    setLoading(true);
    listExpenses({ ...range, categoryId: categoryId || undefined, search: query || undefined, page: 1, limit: 100 })
      .then((expensesResponse) => {
        if (!current) return;
        setResult(expensesResponse);
        setError("");
      })
      .catch((requestError) => { if (current) setError(requestError.message || "Could not load expenses."); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [range, categoryId, query]);

  useEffect(() => {
    let current = true;
    listExpenseCategories()
      .then((response) => { if (current) setCategories(response.data); })
      .catch((requestError) => { if (current) setError(requestError.message || "Could not load expense categories."); });
    return () => { current = false; };
  }, []);

  const exportCsv = () => {
    const rows = [["Date", "Reference / voucher number", "Category", "Beneficiary", "Description", "Payment method", "Amount (LKR)"], ...result.data.map((expense) => [expense.expense_date, expense.reference_no, expense.category_name, expense.beneficiary, expense.description ?? "", expense.payment_method, expense.amount])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "ha-expense-ledger.csv"; anchor.click(); URL.revokeObjectURL(url);
  };

  return <div className="expense-content reference-expense-page">
    <div className="reference-heading">
      <div className="reference-title-block">
        <div className="reference-eyebrow"><span>H&amp;A · Finance</span><i/> Expense ledger <b>·</b> LKR</div>
        <h1>Expense <em>Management</em></h1>
        <p>Track product purchases, marketing, and day-to-day operating expenses in one place.</p>
      </div>
      <div className="reference-heading-actions">
        <div className="period-control" aria-label="Filter expenses by period">{["Weekly", "Monthly", "Quarterly"].map((value) => <button type="button" aria-pressed={period === value} className={period === value ? "is-selected" : ""} onClick={() => setPeriod(value)} key={value}>{value === "Quarterly" ? `Q${Math.floor(new Date().getMonth() / 3) + 1}` : value}</button>)}</div>
        <button type="button" className="expense-button export-button" onClick={exportCsv} disabled={!result.data.length}><Icon name="arrowUpRight" size={14}/> Export CSV</button>
      </div>
    </div>
    <section className="expense-kpis" aria-label="Expense summary">
      <article className="expense-kpi"><div className="kpi-label">Expenses in period <Icon name="bag" size={15}/></div><strong>Rs. {Number(result.meta.totalAmount || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })} <small>LKR</small></strong><small><i>{period}</i> Total recorded expenses</small></article>
      <article className="expense-kpi"><div className="kpi-label">Expense records <Icon name="file" size={15}/></div><strong>{result.meta.total || 0} <small>records</small></strong><small><i>{result.data.length} shown</i> Matching filters</small></article>
      <article className="expense-kpi"><div className="kpi-label">Expense categories <Icon name="grid" size={15}/></div><strong>{categories.length} <small>active</small></strong><small><b className="kpi-dot"/> Available for recording</small></article>
      <article className="expense-kpi"><div className="kpi-label">Selected period <Icon name="file" size={15}/></div><strong>{localDate(`${range.from}T12:00:00`)}</strong><small><i>Through today</i> {localDate(`${range.to}T12:00:00`)}</small></article>
    </section>
    <section className="expense-journal reference-ledger">
      <div className="reference-ledger-heading">
        <div><h2>Expense ledger</h2><p>Recorded expenses for the selected period</p></div>
        <div className="ledger-actions">
          <div className="ledger-categories" aria-label="Filter by category">
              <button type="button" className={!categoryId ? "is-selected" : ""} aria-pressed={!categoryId} onClick={() => setCategoryId("")}>All categories</button>
              {categoryFilters.map(({ label, category }) => <button type="button" className={category && String(categoryId) === String(category.id) ? "is-selected" : ""} aria-pressed={Boolean(category && String(categoryId) === String(category.id))} onClick={() => category && setCategoryId(String(category.id))} disabled={!category} key={label}>{label}</button>)}
              {customCategories.map((category) => <button type="button" className={String(categoryId) === String(category.id) ? "is-selected" : ""} aria-pressed={String(categoryId) === String(category.id)} onClick={() => setCategoryId(String(category.id))} key={category.id}>{category.name}</button>)}
          </div>
          <Link to="/admin/finance/expenses/categories" className="expense-button record-button"><Icon name="plus" size={15}/> Add expense categories</Link>
          <Link to="/admin/finance/expenses/new" className="expense-button record-button"><Icon name="plus" size={15}/> Add expense</Link>
        </div>
      </div>
      <div className="ledger-tools"><label className="ledger-search"><Icon name="search" size={15}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reference, beneficiary, or category" aria-label="Search expenses"/></label><span>{localDate(`${range.from}T12:00:00`)} – {localDate(`${range.to}T12:00:00`)}</span></div>
      <div className="ledger-rule"/>
      {error && <div className="expense-error" role="alert">{error}</div>}
      <div className="expense-table-wrap"><table className="expense-table reference-table"><thead><tr><th>Date</th><th>Reference / voucher</th><th>Category</th><th>Beneficiary</th><th>Payment method</th><th>Amount</th><th>Action</th></tr></thead><tbody>{result.data.map((expense) => <tr key={expense.id}>
        <td className="expense-date">{localDate(`${expense.expense_date}T12:00:00`)}</td>
        <td className="voucher-cell">{expense.reference_no}</td>
        <td><span className="expense-category-tag">{expense.category_name}</span></td>
        <td><strong className="vendor-name">{expense.beneficiary}</strong>{expense.description && <small className="expense-reference">{expense.description}</small>}</td>
        <td className="payment-method">{expense.payment_method}</td>
        <td className="expense-amount">Rs. {Number(expense.amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
        <td><Link to={`/admin/finance/expenses/${expense.id}`} className="expense-view-button">View</Link></td>
      </tr>)}</tbody></table>{loading && <div className="expense-empty">Loading expenses…</div>}{!loading && !error && !result.data.length && <div className="expense-empty">No expenses match this period and filters.</div>}</div>
      <div className="journal-footer"><span>Showing {result.data.length} of {result.meta.total || 0} expense records</span><span>Amounts in Sri Lankan rupees (LKR)</span></div>
    </section>
    <footer className="expense-footer"><span>H&amp;A Clothing · Finance</span><span>Financial Management · Member 7</span></footer>
  </div>;
}
