import { Link } from "react-router-dom";

// items: [{ label, to? }]. The last item is the current page.
export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label}>
            {item.to && !isLast ? <Link to={item.to}>{item.label}</Link> : <strong>{item.label}</strong>}
            {!isLast && <span className="breadcrumbs__sep">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
