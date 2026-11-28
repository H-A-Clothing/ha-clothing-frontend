// Admin API calls for Member 8 (roles, staff management, admin profile).
import { apiClient, mockResponse } from "./client";
import { mockAdminProfile, mockRoles, mockStaff } from "./mocks/admin.mock";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

let rolesStore = structuredClone(mockRoles);
let staffStore = structuredClone(mockStaff);
let profileStore = structuredClone(mockAdminProfile);

export async function fetchRoles() {
  if (USE_MOCKS) return mockResponse(rolesStore);
  const res = await apiClient.get("/admin/roles");
  return res?.data ?? res;
}

export async function createRole(payload) {
  if (USE_MOCKS) {
    const newRole = {
      id: rolesStore.length + 1,
      name: payload.name,
      description: payload.description || "",
      permissions: payload.permissions || [],
    };
    rolesStore = [...rolesStore, newRole];
    return mockResponse(newRole);
  }
  const res = await apiClient.post("/admin/roles", payload);
  return res?.data ?? res;
}

export async function updateRole(roleId, payload) {
  if (USE_MOCKS) {
    rolesStore = rolesStore.map((r) =>
      r.id === roleId ? { ...r, ...payload } : r,
    );
    return mockResponse(rolesStore.find((r) => r.id === roleId));
  }
  const res = await apiClient.patch(`/admin/roles/${roleId}`, payload);
  return res?.data ?? res;
}

export async function fetchStaff() {
  if (USE_MOCKS) return mockResponse(staffStore);
  const res = await apiClient.get("/admin/staff");
  return res?.data ?? res;
}

export async function assignStaff(payload) {
  if (USE_MOCKS) {
    const matchedRole = rolesStore.find(
      (r) => r.id === Number(payload.role_id),
    );
    const entry = {
      user_id: Number(payload.user_id),
      email: `staff${payload.user_id}@haclothing.lk`,
      first_name: "Staff",
      last_name: `#${payload.user_id}`,
      phone: "",
      user_active: payload.is_active,
      role_id: Number(payload.role_id),
      role_name: matchedRole ? matchedRole.name : "staff",
      job_title: payload.job_title,
      department: payload.department || "Store Operations",
      staff_active: payload.is_active,
      last_login_at: null,
    };
    const exists = staffStore.some((s) => s.user_id === entry.user_id);
    staffStore = exists
      ? staffStore.map((s) =>
          s.user_id === entry.user_id ? { ...s, ...entry } : s,
        )
      : [entry, ...staffStore];
    return mockResponse(entry);
  }
  const res = await apiClient.post("/admin/staff", payload);
  return res?.data ?? res;
}

export async function fetchAdminProfile() {
  if (USE_MOCKS) return mockResponse(profileStore);
  const res = await apiClient.get("/admin/profile");
  return res?.data ?? res;
}

export async function updateAdminProfile(payload) {
  if (USE_MOCKS) {
    profileStore = { ...profileStore, ...payload };
    return mockResponse(profileStore);
  }
  const res = await apiClient.patch("/admin/profile", payload);
  return res?.data ?? res;
}
