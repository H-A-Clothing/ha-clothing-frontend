import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "96px var(--gutter)", textAlign: "center" }}>
      <span className="eyebrow">Error 404</span>
      <h1 className="page-title" style={{ margin: "12px 0 24px" }}>
        Page <em>not found</em>
      </h1>
      <Link to="/" className="btn btn--primary">
        Return home
      </Link>
    </div>
  );
}
