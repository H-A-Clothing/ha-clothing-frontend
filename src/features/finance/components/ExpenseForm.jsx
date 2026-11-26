import Icon from "../../../components/Icon";
import { EXPENSE_PAYMENT_METHODS } from "../../../utils/constants";

function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function emptyExpense() {
  return { category_id: "", beneficiary: "", description: "", amount: "", expense_date: todayLocal(), payment_method: EXPENSE_PAYMENT_METHODS[0], reference_no: "", notes: "" };
}

export function expenseFormValue(expense) {
  const expenseDate = expense.expense_date instanceof Date
    ? expense.expense_date.toISOString().slice(0, 10)
    : String(expense.expense_date ?? "").slice(0, 10);
  return {
    category_id: String(expense.category_id), beneficiary: expense.beneficiary ?? "", description: expense.description ?? "",
    amount: String(expense.amount), expense_date: expenseDate, payment_method: expense.payment_method,
    reference_no: expense.reference_no, notes: expense.notes ?? "",
  };
}

export default function ExpenseForm({ categories, value, onChange, onSubmit, onDiscard, submitLabel, error, saving }) {
  const today = todayLocal();
  return <form className="expense-editor-form" onSubmit={onSubmit}>
    <div className="form-grid">
      <label className="expense-field"><span>Category <b>*</b></span><select name="category_id" value={value.category_id} onChange={onChange} required><option value="" disabled>Select a category</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}{category.is_active ? "" : " (archived)"}</option>)}</select></label>
      <label className="expense-field"><span>Date <b>*</b></span><input name="expense_date" type="date" value={value.expense_date} onChange={onChange} max={today} required/></label>
      <label className="expense-field field-full"><span>Beneficiary <b>*</b></span><input name="beneficiary" value={value.beneficiary} onChange={onChange} maxLength={200} placeholder="Person or business paid" required/></label>
      <label className="expense-field"><span>Amount (LKR) <b>*</b></span><div className="amount-input"><span>Rs.</span><input name="amount" type="number" min="0.01" max="99999999.99" step="0.01" value={value.amount} onChange={onChange} placeholder="0.00" required/></div></label>
      <label className="expense-field"><span>Payment method <b>*</b></span><select name="payment_method" value={value.payment_method} onChange={onChange} required>{EXPENSE_PAYMENT_METHODS.map((method) => <option key={method}>{method}</option>)}</select></label>
      <label className="expense-field field-full"><span>Reference / voucher number <b>*</b></span><input name="reference_no" value={value.reference_no} onChange={onChange} maxLength={100} placeholder="Enter the finance reference or voucher number" required/></label>
      <label className="expense-field field-full"><span>Description</span><textarea name="description" value={value.description} onChange={onChange} maxLength={2000} placeholder="Optional description"/></label>
      <label className="expense-field field-full"><span>Notes</span><textarea name="notes" value={value.notes} onChange={onChange} maxLength={4000} placeholder="Optional internal notes"/></label>
    </div>
    {error && <p className="expense-form-error" role="alert">{error}</p>}
    <div className="expense-form-actions"><button className="expense-button cancel-button" type="button" onClick={onDiscard}>Discard changes</button><button className="expense-button save-button" type="submit" disabled={saving}><Icon name="check" size={14}/>{saving ? "Saving…" : submitLabel}</button></div>
  </form>;
}

