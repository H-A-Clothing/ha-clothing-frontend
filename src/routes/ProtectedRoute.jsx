// Protected route wrapper for role-based access control on the frontend.
import { Navigate } from "react-router-dom";

const DEFAULT_ADMIN_ROLES = [
  "admin",
  "staff",
  "inventory_manager",
  "finance_manager",
  "order_manager",
];

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ProtectedRoute({
  children,
  allowedRoles = DEFAULT_ADMIN_ROLES,
}) {
  const user = getStoredUser();

  // If a logged-in user exists, enforce role checks strictly.
  if (user) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // Allow local preview while Member 3's login flow is still under development.
  if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true") {
    return children;
  }

  return <Navigate to="/login" replace />;
}
