import "../finance.css";

export default function FinanceSection({ title }) {
  return <section className="expense-content reference-expense-page finance-section-placeholder"><div className="reference-heading"><div className="reference-title-block"><h1>{title}</h1><p>Review and manage {title.toLowerCase()}.</p></div></div></section>;
}
