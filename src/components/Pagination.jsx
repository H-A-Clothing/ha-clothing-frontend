import Icon from "./Icon";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__nav"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <Icon name="arrowLeft" size={14} /> Previous
      </button>
      <div className="pagination__pages">
        {pages.map((number) => (
          <button
            key={number}
            type="button"
            className={`pagination__page${number === page ? " is-active" : ""}`}
            aria-current={number === page ? "page" : undefined}
            onClick={() => onChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="pagination__nav"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next <Icon name="arrowRight" size={14} />
      </button>
    </nav>
  );
}
