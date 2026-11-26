import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";
import { createExpenseCategory, listExpenseCategories, removeExpenseCategory } from "../../../api/finance";

const defaultNames = ["Product purchases", "Marketing", "Transport", "Packaging", "Rent", "Utilities", "Other"];

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = async () => {
    const response = await listExpenseCategories();
    setCategories(response.data);
  };
  useEffect(() => {
    let current = true;
    listExpenseCategories().then((response) => { if (current) setCategories(response.data); })
      .catch((requestError) => { if (current) setError(requestError.message || "Could not load categories."); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, []);

  const addCategory = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      await createExpenseCategory({ name: name.trim() });
      setName(""); setNotice("Expense category added."); await refresh();
    } catch (requestError) {
      setError(requestError.message || "Could not add this category.");
    } finally { setSaving(false); }
  };

  const removeCategory = async (category) => {
    if (!window.confirm(`Remove “${category.name}” from available expense categories? Existing expenses will keep their category.`)) return;
    setError(""); setNotice("");
    try {
      await removeExpenseCategory(category.id);
      setNotice(`${category.name} removed from available categories.`);
      await refresh();
    } catch (requestError) {
      setError(requestError.message || "Could not remove this category.");
    }
  };

  return <section className="expense-content reference-expense-page">
    <div className="reference-heading expense-subpage-heading"><div className="reference-title-block"><div className="reference-eyebrow"><span>H&amp;A · Finance</span><i/> Expense setup</div><h1>Expense <em>Categories</em></h1><p>Add categories for new expenses or remove categories no longer in use.</p></div><Link to="/admin/finance/expenses" className="expense-button export-button"><Icon name="arrowLeft" size={14}/> Back to expenses</Link></div>
    {error && <p className="expense-form-error expense-page-error" role="alert">{error}</p>}{notice && <p className="expense-notice" role="status">{notice}</p>}
    <section className="expense-editor-card category-editor-card"><div className="expense-editor-heading"><div><h2>Add expense category</h2><p>The initial categories are listed below. You can add more as needed.</p></div></div><form className="category-add-form" onSubmit={addCategory}><label className="expense-field"><span>Category name <b>*</b></span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} list="expense-default-categories" placeholder="Enter a category name" required/><datalist id="expense-default-categories">{defaultNames.map((item) => <option key={item} value={item}/>)}</datalist></label><button className="expense-button record-button" type="submit" disabled={saving}><Icon name="plus" size={15}/>{saving ? "Adding…" : "Add category"}</button></form></section>
    <section className="expense-editor-card category-list-card"><div className="expense-editor-heading"><div><h2>Available categories</h2><p>Removing a category hides it from new expenses and keeps existing records intact.</p></div></div>{loading ? <div className="expense-empty">Loading categories…</div> : <div className="category-list">{categories.map((category) => <div className="category-list-row" key={category.id}><div><strong>{category.name}</strong><small>{category.expense_count} expense record{category.expense_count === 1 ? "" : "s"}</small></div><button className="category-remove-button" type="button" onClick={() => removeCategory(category)}><Icon name="close" size={14}/> Remove</button></div>)}{!categories.length && <div className="expense-empty">No active expense categories.</div>}</div>}</section>
  </section>;
}
