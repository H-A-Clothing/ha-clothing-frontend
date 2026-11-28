// Mock data for Member 8 Admin & RBAC views when VITE_USE_MOCKS=true.
export const mockRoles = [
  {
    id: 1,
    name: "customer",
    description: "Shops on the storefront",
    permissions: [],
  },
  {
    id: 2,
    name: "admin",
    description: "Full access to the admin area",
    permissions: ["*"],
  },
  {
    id: 3,
    name: "staff",
    description: "General store staff with limited admin access",
    permissions: ["orders:read", "products:read", "faqs:manage"],
  },
  {
    id: 4,
    name: "inventory_manager",
    description: "Manages stock, suppliers, and purchase orders",
    permissions: ["inventory:manage", "products:read"],
  },
  {
    id: 5,
    name: "finance_manager",
    description: "Manages product costs, expenses, and financial reports",
    permissions: ["finance:manage", "orders:read"],
  },
  {
    id: 6,
    name: "order_manager",
    description: "Manages order processing, returns, and deliveries",
    permissions: ["orders:manage", "deliveries:manage"],
  },
];

export const mockStaff = [
  {
    user_id: 1,
    email: "admin@haclothing.lk",
    first_name: "Hiruni",
    last_name: "Chamodi",
    phone: "0743875049",
    user_active: true,
    role_id: 2,
    role_name: "admin",
    job_title: "Store Owner & Lead Admin",
    department: "Management",
    staff_active: true,
    last_login_at: "2026-11-28T02:30:00Z",
  },
  {
    user_id: 8,
    email: "senuri@haclothing.lk",
    first_name: "Senuri",
    last_name: "Wickramasinghe",
    phone: "0710000008",
    user_active: true,
    role_id: 3,
    role_name: "staff",
    job_title: "System & Analytics Coordinator",
    department: "Operations",
    staff_active: true,
    last_login_at: "2026-11-28T03:00:00Z",
  },
];

export const mockAdminProfile = {
  id: 8,
  email: "senuri@haclothing.lk",
  first_name: "Senuri",
  last_name: "Wickramasinghe",
  phone: "0743875049",
  role: "admin",
  permissions: ["*"],
  job_title: "System & Analytics Administrator",
  department: "Administration",
  last_login_at: "2026-11-28T03:00:00Z",
};
