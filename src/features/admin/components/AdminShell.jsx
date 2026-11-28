import { NavLink, Outlet } from "react-router-dom";
import "../admin.css";

export default function AdminShell() {
  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "8px 14px",
    borderRadius: "var(--radius)",
    color: isActive ? "#ffffff" : "var(--color-text)",
    background: isActive ? "var(--color-ink)" : "transparent",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <nav
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          padding: "14px var(--gutter)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--color-ink)",
              }}
            >
              H&amp;A CLOTHING
            </span>
            <span className="m8-badge">Admin Console</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <NavLink to="/admin/staff" style={linkStyle}>
              Staff &amp; Roles
            </NavLink>
            <NavLink to="/admin/profile" style={linkStyle}>
              Admin Profile
            </NavLink>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
