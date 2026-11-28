import { useEffect, useState } from "react";
import { fetchAdminProfile, updateAdminProfile } from "../../../api/admin";
import "../admin.css";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    job_title: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await fetchAdminProfile();
        setProfile(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          job_title: data.job_title || "",
        });
      } catch (err) {
        setFeedback({
          type: "error",
          text: err.message || "Failed to load admin profile",
        });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: "", text: "" });
    try {
      const updated = await updateAdminProfile(form);
      setProfile((prev) => ({ ...prev, ...updated }));
      setFeedback({
        type: "success",
        text: "Admin profile updated successfully.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="m8-admin-page">
      <header className="m8-page-header">
        <div>
          <p className="m8-eyebrow">Account &amp; Access</p>
          <h1 className="m8-title">Admin Profile</h1>
          <p className="m8-subtitle">
            Review your assigned administrative role, permissions, and contact
            details.
          </p>
        </div>
      </header>

      {feedback.text && (
        <div className={`m8-alert ${feedback.type}`}>{feedback.text}</div>
      )}

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <div className="m8-grid-2">
          <section className="m8-card">
            <h2 className="m8-card-title">Personal &amp; Role Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="m8-form-group">
                <label className="m8-label" htmlFor="prof-first">
                  First Name
                </label>
                <input
                  id="prof-first"
                  type="text"
                  required
                  className="m8-input"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                />
              </div>

              <div className="m8-form-group">
                <label className="m8-label" htmlFor="prof-last">
                  Last Name
                </label>
                <input
                  id="prof-last"
                  type="text"
                  required
                  className="m8-input"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                />
              </div>

              <div className="m8-form-group">
                <label className="m8-label" htmlFor="prof-phone">
                  Phone Number
                </label>
                <input
                  id="prof-phone"
                  type="text"
                  className="m8-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="m8-form-group">
                <label className="m8-label" htmlFor="prof-title">
                  Job Title
                </label>
                <input
                  id="prof-title"
                  type="text"
                  className="m8-input"
                  value={form.job_title}
                  onChange={(e) =>
                    setForm({ ...form, job_title: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="m8-btn-primary"
                disabled={saving}
              >
                {saving ? "Updating..." : "Save Profile"}
              </button>
            </form>
          </section>

          <section className="m8-card">
            <h2 className="m8-card-title">Security &amp; Permissions</h2>
            <p style={{ fontSize: "14px", marginBottom: "12px" }}>
              <strong>Email:</strong> {profile?.email || "—"}
            </p>
            <p style={{ fontSize: "14px", marginBottom: "12px" }}>
              <strong>Assigned Role:</strong>{" "}
              <span className="m8-badge">{profile?.role || "admin"}</span>
            </p>
            <div style={{ marginTop: "16px" }}>
              <span className="m8-label">Granted Permissions</span>
              <div style={{ marginTop: "8px" }}>
                {Array.isArray(profile?.permissions) &&
                profile.permissions.length > 0 ? (
                  profile.permissions.map((perm) => (
                    <span key={perm} className="m8-badge">
                      {perm === "*"
                        ? "All Administrative Permissions (*)"
                        : perm}
                    </span>
                  ))
                ) : (
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Standard administrative access
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
