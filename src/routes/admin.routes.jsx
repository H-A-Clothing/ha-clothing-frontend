// M7 – financial management and reporting.
import ExpensePage from "../features/finance/pages/ExpensePage";
import FinanceLayout, { FinanceSection } from "../features/finance/FinanceLayout";

export const adminRoutes = [
  {
    path: "/admin/finance",
    element: <FinanceLayout />,
    children: [
      { index: true, element: <FinanceSection title="Dashboard" /> },
      { path: "expenses", element: <ExpensePage /> },
      { path: "expenses/new", element: <ExpensePage mode="new" /> },
      { path: "product-costs", element: <FinanceSection title="Product Costs" /> },
      { path: "reports", element: <FinanceSection title="Reports" /> },
      { path: "reconciliation", element: <FinanceSection title="Reconciliation" /> },
      { path: "settings", element: <FinanceSection title="Settings" /> },
    ],
  },
];
