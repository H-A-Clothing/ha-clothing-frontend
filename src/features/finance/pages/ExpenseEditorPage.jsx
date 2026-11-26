import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import { createExpense, getExpense, listExpenseCategories, updateExpense } from "../../../api/finance";
import ExpenseForm, { emptyExpense, expenseFormValue } from "../components/ExpenseForm";

function errorMessage(error) {
  const fields = error.details ? Object.values(error.details).join(" ") : "";
  return [error.message, fields].filter(Boolean).join(" — ");
}

export default function ExpenseEditorPage({ editing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState(emptyExpense);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let current = true;
    const requests = [listExpenseCategories(editing ? { includeInactive: true } : undefined)];
    if (editing) requests.push(getExpense(id));
    Promise.all(requests).then(([categoryResponse, expenseResponse]) => {
      if (!current) return;
      setCategories(categoryResponse.data);
      if (expenseResponse) setValue(expenseFormValue(expenseResponse.data));
      else if (categoryResponse.data[0]) setValue((previous) => ({ ...previous, category_id: String(categoryResponse.data[0].id) }));
      setError("");
    }).catch((requestError) => { if (current) setError(errorMessage(requestError)); }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [editing, id]);

  const onChange = (event) => setValue((current) => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      category_id: Number(value.category_id), beneficiary: value.beneficiary.trim(),
      description: value.description.trim() || null, amount: Number(value.amount), expense_date: value.expense_date,
      payment_method: value.payment_method, reference_no: value.reference_no.trim(), notes: value.notes.trim() || null,
    };
    try {
      const response = editing ? await updateExpense(id, payload) : await createExpense(payload);
      navigate(`/admin/finance/expenses/${response.data.id}`, { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const title = editing ? "Edit expense" : "Add expense";
  const discardPath = editing ? `/admin/finance/expenses/${id}` : "/admin/finance/expenses";
  return <section className="expense-content reference-expense-page">
    <div className="reference-heading expense-subpage-heading"><div className="reference-title-block"><div className="reference-eyebrow"><span>H&amp;A · Finance</span><i/> Expense ledger</div><h1>{title}</h1><p>{editing ? "Update the recorded expense details." : "Enter the expense details for the finance ledger."}</p></div><Link to="/admin/finance/expenses" className="expense-button export-button"><Icon name="arrowLeft" size={14}/> Back to expenses</Link></div>
    {loading ? <div className="expense-empty">Loading expense details…</div> : <section className="expense-editor-card"><div className="expense-editor-heading"><div><h2>{editing ? "Expense details" : "Expense information"}</h2><p>Required fields are marked with an asterisk.</p></div></div>{error && !categories.length && <p className="expense-form-error" role="alert">{error}</p>}<ExpenseForm categories={categories} value={value} onChange={onChange} onSubmit={onSubmit} onDiscard={() => navigate(discardPath)} submitLabel={editing ? "Save changes" : "Save expense"} error={categories.length ? error : ""} saving={saving}/></section>}
  </section>;
}
