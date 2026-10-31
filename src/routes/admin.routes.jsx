// M7 – financial management and reporting.
import ExpensePage from "../features/finance/pages/ExpensePage";

export const adminRoutes = [
  { path: "/admin/finance/expenses", element: <ExpensePage /> },
  { path: "/admin/finance/expenses/new", element: <ExpensePage mode="new" /> },
];
