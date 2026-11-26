import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import { deleteExpense, getExpense } from "../../../api/finance";

const fmtDate = (value) => {
  const dateOnly = value instanceof Date
    ? (Number.isNaN(value.valueOf()) ? "" : value.toISOString().slice(0, 10))
    : String(value ?? "").match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return "Date unavailable";
  const date = new Date(`${dateOnly}T12:00:00`);
  return Number.isNaN(date.valueOf())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-LK", { day: "2-digit", month: "long", year: "numeric" }).format(date);
};
const fmtMoney = (value) => Number(value).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ExpenseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let current = true;
    getExpense(id).then((response) => { if (current) setExpense(response.data); })
      .catch((requestError) => { if (current) setError(requestError.message || "Could not load this expense."); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [id]);

  const remove = async () => {
    if (!window.confirm(`Delete expense ${expense.reference_no}? This will permanently remove it from the database.`)) return;
    setDeleting(true);
    setError("");
    try {
      await deleteExpense(id);
      navigate("/admin/finance/expenses", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Could not delete this expense.");
      setDeleting(false);
    }
  };

  return <section className="expense-content reference-expense-page">
    <div className="reference-heading expense-subpage-heading"><div className="reference-title-block"><div className="reference-eyebrow"><span>H&amp;A · Finance</span><i/> Expense details</div><h1>{expense?.reference_no || "Expense details"}</h1><p>Review the recorded expense and its payment information.</p></div><Link to="/admin/finance/expenses" className="expense-button export-button"><Icon name="arrowLeft" size={14}/> Back to expenses</Link></div>
    {error && <p className="expense-form-error expense-page-error" role="alert">{error}</p>}
    {loading ? <div className="expense-empty">Loading expense details…</div> : expense && <section className="expense-detail-card"><div className="expense-detail-heading"><div><span className="modal-eyebrow">Expense reference</span><h2>{expense.reference_no}</h2></div><div className="expense-detail-actions"><Link className="expense-button export-button" to={`/admin/finance/expenses/${expense.id}/edit`}><Icon name="file" size={14}/> Edit</Link><button className="expense-button delete-button" type="button" onClick={remove} disabled={deleting}><Icon name="close" size={14}/>{deleting ? "Deleting…" : "Delete"}</button></div></div>
      <dl className="expense-detail-grid"><div><dt>Date</dt><dd>{fmtDate(expense.expense_date)}</dd></div><div><dt>Category</dt><dd>{expense.category_name}</dd></div><div><dt>Beneficiary</dt><dd>{expense.beneficiary}</dd></div><div><dt>Payment method</dt><dd>{expense.payment_method}</dd></div><div><dt>Amount</dt><dd>Rs. {fmtMoney(expense.amount)} LKR</dd></div><div><dt>Reference / voucher number</dt><dd>{expense.reference_no}</dd></div>{expense.description && <div className="detail-full"><dt>Description</dt><dd>{expense.description}</dd></div>}</dl>
    </section>}
  </section>;
}
