import { useState, useEffect } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // Add User form
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", address: "", role: "USER" });
  const [userMsg, setUserMsg] = useState("");

  // Add Store form
  const [storeForm, setStoreForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [storeMsg, setStoreMsg] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes, storesRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/stores"),
      ]);
      setStats(dashRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserMsg("");
    try {
      await api.post("/admin/users", userForm);
      setUserMsg("✅ User created successfully!");
      setUserForm({ name: "", email: "", password: "", address: "", role: "USER" });
      fetchAll();
    } catch (err) {
      setUserMsg("❌ " + (err.response?.data?.message || "Error creating user"));
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setStoreMsg("");
    try {
      await api.post("/admin/stores", storeForm);
      setStoreMsg("✅ Store created successfully!");
      setStoreForm({ name: "", email: "", address: "", ownerId: "" });
      fetchAll();
    } catch (err) {
      setStoreMsg("❌ " + (err.response?.data?.message || "Error creating store"));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const storeOwners = users.filter(u => u.role === "STORE_OWNER");

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Navbar */}
      <nav className="navbar navbar-dark" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "12px 24px" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold fs-5 mb-0">
            <span style={{ color: "#e94560" }}>●</span> StoreRater <span className="badge ms-2" style={{ background: "#e94560", fontSize: "11px" }}>ADMIN</span>
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container-fluid py-4 px-4">
        {/* Tab Navigation */}
        <ul className="nav nav-pills mb-4" style={{ gap: "8px" }}>
          {[["dashboard", "📊 Dashboard"], ["users", "👥 Users"], ["add-user", "➕ Add User"], ["stores", "🏪 Stores"], ["add-store", "➕ Add Store"]].map(([tab, label]) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? { background: "#0f3460", color: "white" } : { color: "#444" }}
              >{label}</button>
            </li>
          ))}
        </ul>

        {loading && <div className="text-center py-5"><div className="spinner-border" style={{ color: "#0f3460" }}></div></div>}

        {/* Dashboard Tab */}
        {!loading && activeTab === "dashboard" && (
          <div className="row g-4">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#667eea" },
              { label: "Total Stores", value: stats.totalStores, icon: "🏪", color: "#f7971e" },
              { label: "Total Ratings", value: stats.totalRatings, icon: "⭐", color: "#56ab2f" },
            ].map(({ label, value, icon, color }) => (
              <div className="col-md-4" key={label}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <div className="card-body d-flex align-items-center gap-4 p-4">
                    <div style={{ fontSize: "48px", lineHeight: 1 }}>{icon}</div>
                    <div>
                      <div className="text-muted small fw-semibold text-uppercase">{label}</div>
                      <div className="fw-bold" style={{ fontSize: "2.5rem", color, lineHeight: 1.1 }}>{value}</div>
                    </div>
                  </div>
                  <div style={{ height: "4px", background: color }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {!loading && activeTab === "users" && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-header border-0 bg-white pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">All Users <span className="badge bg-secondary ms-2">{users.length}</span></h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "#f8f9fa" }}>
                    <tr>
                      <th className="px-4 py-3 border-0">ID</th>
                      <th className="py-3 border-0">Name</th>
                      <th className="py-3 border-0">Email</th>
                      <th className="py-3 border-0">Address</th>
                      <th className="py-3 border-0">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 text-muted small">{u.id}</td>
                        <td className="py-3 fw-semibold">{u.name}</td>
                        <td className="py-3 text-muted">{u.email}</td>
                        <td className="py-3 text-muted">{u.address || "—"}</td>
                        <td className="py-3">
                          <span className="badge" style={{
                            background: u.role === "ADMIN" ? "#e94560" : u.role === "STORE_OWNER" ? "#f7971e" : "#667eea",
                            color: "white", padding: "4px 10px"
                          }}>{u.role}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add User Tab */}
        {!loading && activeTab === "add-user" && (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Add New User</h5>
                  {userMsg && <div className={`alert ${userMsg.startsWith("✅") ? "alert-success" : "alert-danger"} py-2`}>{userMsg}</div>}
                  <form onSubmit={handleAddUser}>
                    {[["Name", "name", "text"], ["Email", "email", "email"], ["Password", "password", "password"], ["Address", "address", "text"]].map(([label, field, type]) => (
                      <div className="mb-3" key={field}>
                        <label className="form-label fw-semibold small">{label}</label>
                        <input className="form-control" type={type} required={field !== "address"}
                          value={userForm[field]} onChange={e => setUserForm({ ...userForm, [field]: e.target.value })} />
                      </div>
                    ))}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">Role</label>
                      <select className="form-select" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                        <option value="USER">USER</option>
                        <option value="STORE_OWNER">STORE_OWNER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <button type="submit" className="btn w-100 text-white fw-semibold" style={{ background: "#0f3460", borderRadius: "10px", padding: "10px" }}>Create User</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stores Tab */}
        {!loading && activeTab === "stores" && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-header border-0 bg-white pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">All Stores <span className="badge bg-secondary ms-2">{stores.length}</span></h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "#f8f9fa" }}>
                    <tr>
                      <th className="px-4 py-3 border-0">ID</th>
                      <th className="py-3 border-0">Name</th>
                      <th className="py-3 border-0">Email</th>
                      <th className="py-3 border-0">Address</th>
                      <th className="py-3 border-0">Owner ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map(s => (
                      <tr key={s.id}>
                        <td className="px-4 py-3 text-muted small">{s.id}</td>
                        <td className="py-3 fw-semibold">{s.name}</td>
                        <td className="py-3 text-muted">{s.email}</td>
                        <td className="py-3 text-muted">{s.address}</td>
                        <td className="py-3 text-muted">#{s.ownerId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add Store Tab */}
        {!loading && activeTab === "add-store" && (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Add New Store</h5>
                  {storeMsg && <div className={`alert ${storeMsg.startsWith("✅") ? "alert-success" : "alert-danger"} py-2`}>{storeMsg}</div>}
                  <form onSubmit={handleAddStore}>
                    {[["Store Name", "name", "text"], ["Store Email", "email", "email"], ["Address", "address", "text"]].map(([label, field, type]) => (
                      <div className="mb-3" key={field}>
                        <label className="form-label fw-semibold small">{label}</label>
                        <input className="form-control" type={type} required
                          value={storeForm[field]} onChange={e => setStoreForm({ ...storeForm, [field]: e.target.value })} />
                      </div>
                    ))}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">Store Owner</label>
                      <select className="form-select" required value={storeForm.ownerId}
                        onChange={e => setStoreForm({ ...storeForm, ownerId: e.target.value })}>
                        <option value="">-- Select a Store Owner --</option>
                        {storeOwners.map(o => (
                          <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                        ))}
                      </select>
                      {storeOwners.length === 0 && <small className="text-muted">No STORE_OWNER users found. Add one first.</small>}
                    </div>
                    <button type="submit" className="btn w-100 text-white fw-semibold" style={{ background: "#0f3460", borderRadius: "10px", padding: "10px" }}>Create Store</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
