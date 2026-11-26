// M7 – financial management and reporting.
import ExpensePage from "../features/finance/pages/ExpensePage";
import ExpenseEditorPage from "../features/finance/pages/ExpenseEditorPage";
import ExpenseDetailsPage from "../features/finance/pages/ExpenseDetailsPage";
import ExpenseCategoriesPage from "../features/finance/pages/ExpenseCategoriesPage";
import FinanceLayout from "../components/layout/FinanceLayout";
import FinanceSection from "../features/finance/components/FinanceSection";

export const adminRoutes = [
  {
    path: "/admin/finance",
    element: <FinanceLayout />,
    children: [
      { index: true, element: <FinanceSection title="Dashboard" /> },
      { path: "expenses", element: <ExpensePage /> },
      { path: "expenses/new", element: <ExpenseEditorPage /> },
      { path: "expenses/categories", element: <ExpenseCategoriesPage /> },
      { path: "expenses/:id/edit", element: <ExpenseEditorPage editing /> },
      { path: "expenses/:id", element: <ExpenseDetailsPage /> },
      { path: "product-costs", element: <FinanceSection title="Product Costs" /> },
      { path: "reports", element: <FinanceSection title="Reports" /> },
      { path: "reconciliation", element: <FinanceSection title="Reconciliation" /> },
      { path: "settings", element: <FinanceSection title="Settings" /> },
    ],
  },
];
