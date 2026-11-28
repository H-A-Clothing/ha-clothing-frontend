import { useEffect, useState } from "react";
import {
  assignStaff,
  createRole,
  fetchRoles,
  fetchStaff,
} from "../../../api/admin";
import "../admin.css";

const AVAILABLE_PERMISSIONS = [
  "orders:read",
  "orders:manage",
  "products:read",
  "products:manage",
  "inventory:manage",
  "finance:manage",
  "deliveries:manage",
  "faqs:manage",
  "settings:manage",
];

export default function StaffRolesPage() {
  const [activeTab, setActiveTab] = useState("staff");
  const [roles, setRoles] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // Staff assignment form state
  const [staffForm, setStaffForm] = useState({
    user_id: "",
    role_id: "",
    job_title: "",
    department: "",
    is_active: true,
  });

  // New role form state
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  async function loadData() {
    setLoading(true);
    try {
      const [rolesData, staffData] = await Promise.all([
        fetchRoles(),
        fetchStaff(),
      ]);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to load staff and roles",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const staffAssignableRoles = roles.filter((r) => r.name !== "customer");

  async function handleAssignStaff(e) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", text: "" });
    try {
      await assignStaff({
        user_id: Number(staffForm.user_id),
        role_id: Number(staffForm.role_id),
        job_title: staffForm.job_title,
        department: staffForm.department || null,
        is_active: staffForm.is_active,
      });
      setFeedback({
        type: "success",
        text: "Staff role assigned successfully.",
      });
      setStaffForm({
        user_id: "",
        role_id: "",
        job_title: "",
        department: "",
        is_active: true,
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to assign staff role",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function togglePermission(perm) {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  }

  async function handleCreateRole(e) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", text: "" });
    try {
      await createRole(roleForm);
      setFeedback({
        type: "success",
        text: `Role '${roleForm.name}' created successfully.`,
      });
      setRoleForm({ name: "", description: "", permissions: [] });
      await loadData();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to create role",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="m8-admin-page">
      <header className="m8-page-header">
        <div>
          <p className="m8-eyebrow">System Administration</p>
          <h1 className="m8-title">Staff &amp; Role Management</h1>
          <p className="m8-subtitle">
            Manage H&amp;A Clothing team access levels, staff profiles, and
            module permissions.
          </p>
        </div>
      </header>

      {feedback.text && (
        <div className={`m8-alert ${feedback.type}`}>{feedback.text}</div>
      )}

      <div className="m8-tabs" role="tablist">
        <button
          type="button"
          className={`m8-tab ${activeTab === "staff" ? "active" : ""}`}
          onClick={() => setActiveTab("staff")}
        >
          Staff Members ({staff.length})
        </button>
        <button
          type="button"
          className={`m8-tab ${activeTab === "roles" ? "active" : ""}`}
          onClick={() => setActiveTab("roles")}
        >
          Roles &amp; Permissions ({roles.length})
        </button>
      </div>

      {loading ? (
        <p>Loading access control records...</p>
      ) : activeTab === "staff" ? (
        <div className="m8-grid-2">
          <section className="m8-card">
            <h2 className="m8-card-title">Assigned Staff Directory</h2>
            <div className="m8-table-wrap">
              <table className="m8-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Role</th>
                    <th>Job Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.length === 0 ? (
                    <tr>
                      <td colSpan="4">No staff members assigned yet.</td>
                    </tr>
                  ) : (
                    staff.map((member) => (
                      <tr key={member.user_id}>
                        <td>
                          <strong>
                            {member.first_name} {member.last_name}
                          </strong>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            ID #{member.user_id} · {member.email}
                          </div>
                        </td>
                        <td>
                          <span className="m8-badge">{member.role_name}</span>
                        </td>
                        <td>
                          {member.job_title}
                          {member.department && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--color-text-muted)",
                              }}
                            >
                              {member.department}
                            </div>
                          )}
                        </td>
                        <td>
                          <span
                            className={`m8-badge ${
                              member.staff_active
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            {member.staff_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="m8-card">
            <h2 className="m8-card-title">Assign Staff Role</h2>
            <form onSubmit={handleAssignStaff}>
              <div className="m8-form-group">
                <label className="m8-label" htmlFor="staff-user-id">
                  User ID
                </label>
                <input
                  id="staff-user-id"
                  type="number"
                  min="1"
                  required
                  className="m8-input"
                  placeholder="Enter registered user ID"
                  value={staffForm.user_id}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, user_id: e.target.value })
                  }
                />
              </div>

              <div className="m8-form-group">
                <label className="m8-label" htmlFor="staff-role-id">
                  Role
                </label>
                <select
                  id="staff-role-id"
                  required
                  className="m8-select"
                  value={staffForm.role_id}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, role_id: e.target.value })
                  }
                >
                  <option value="">Select staff role...</option>
                  {staffAssignableRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="m8-form-group">
                <label className="m8-label" htmlFor="staff-job-title">
                  Job Title
                </label>
                <input
                  id="staff-job-title"
                  type="text"
                  required
                  className="m8-input"
                  placeholder="e.g. Kurunegala Store Manager"
                  value={staffForm.job_title}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, job_title: e.target.value })
                  }
                />
              </div>

              <div className="m8-form-group">
                <label className="m8-label" htmlFor="staff-department">
                  Department (Optional)
                </label>
                <input
                  id="staff-department"
                  type="text"
                  className="m8-input"
                  placeholder="e.g. Inventory & Retail"
                  value={staffForm.department}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, department: e.target.value })
                  }
                />
              </div>

              <div className="m8-form-group">
                <label className="m8-checkbox-row">
                  <input
                    type="checkbox"
                    checked={staffForm.is_active}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  Active staff account
                </label>
              </div>

              <button
                type="submit"
                className="m8-btn-primary"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Staff Assignment"}
              </button>
            </form>
          </section>
        </div>
      ) : (
        <div className="m8-grid-2">
          <section className="m8-card">
            <h2 className="m8-card-title">System Roles</h2>
            <div className="m8-table-wrap">
              <table className="m8-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Description</th>
                    <th>Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td>
                        <strong>{role.name}</strong>
                      </td>
                      <td>{role.description || "—"}</td>
                      <td>
                        {Array.isArray(role.permissions) &&
                        role.permissions.length > 0 ? (
                          role.permissions.map((perm) => (
                            <span key={perm} className="m8-badge">
                              {perm === "*" ? "Full Access (*)" : perm}
                            </span>
                          ))
                        ) : (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            Storefront only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="m8-card">
            <h2 className="m8-card-title">Create Custom Role</h2>
            <form onSubmit={handleCreateRole}>
              <div className="m8-form-group">
                <label className="m8-label" htmlFor="role-name">
                  Role Key (lowercase)
                </label>
                <input
                  id="role-name"
                  type="text"
                  required
                  className="m8-input"
                  placeholder="e.g. content_editor"
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, name: e.target.value })
                  }
                />
              </div>

              <div className="m8-form-group">
                <label className="m8-label" htmlFor="role-desc">
                  Description
                </label>
                <input
                  id="role-desc"
                  type="text"
                  className="m8-input"
                  placeholder="Short description of responsibilities"
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, description: e.target.value })
                  }
                />
              </div>

              <div className="m8-form-group">
                <span className="m8-label">Permissions</span>
                <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <label key={perm} className="m8-checkbox-row">
                      <input
                        type="checkbox"
                        checked={roleForm.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                      />
                      <span>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="m8-btn-primary"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Role"}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
