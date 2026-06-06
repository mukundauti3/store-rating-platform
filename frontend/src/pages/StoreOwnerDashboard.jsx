import { useState, useEffect } from "react";
import api from "../services/api";

function StarDisplay({ value }) {
  return (
    <span>
      {[1,2,3,4,5].map(star => (
        <span key={star} style={{ color: star <= Math.round(value) ? "#f7971e" : "#ddd", fontSize: "18px" }}>★</span>
      ))}
    </span>
  );
}

function StoreOwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userName = localStorage.getItem("userName") || "Store Owner";

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      // Call each independently so one 404 doesn't crash everything
      const dashRes = await api.get("/store-owner/dashboard").catch(e => ({ data: null, error: e }));
      const storeRes = await api.get("/store-owner/store").catch(e => ({ data: null, error: e }));
      const ratingsRes = await api.get("/store-owner/ratings").catch(e => ({ data: null, error: e }));

      setDashboard(dashRes.data);
      setStore(storeRes.data);
      setRatings(Array.isArray(ratingsRes.data) ? ratingsRes.data : []);

      // If no store found for this owner
      if (!dashRes.data && !storeRes.data) {
        setError("no_store");
      }
    } catch (err) {
      setError("fetch_failed");
    }
    setLoading(false);
  };

  const handleLogout = () => { localStorage.clear(); window.location.reload(); };

  const ratingDistribution = [5,4,3,2,1].map(star => ({
    star,
    count: ratings.filter(r => r.rating === star).length,
  }));
  const maxCount = Math.max(...ratingDistribution.map(r => r.count), 1);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "white", fontWeight: 800, fontSize: "18px" }}>
          <span style={{ color: "#f7971e" }}>●</span> StoreRater{" "}
          <span style={{ background: "#f7971e", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "99px", fontWeight: 700, marginLeft: "8px" }}>STORE OWNER</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#aaa", fontSize: "14px" }}>👤 {userName}</span>
          <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: "28px 32px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
          {[["dashboard", "📊 Dashboard"], ["store", "🏪 My Store"], ["ratings", "⭐ Ratings"]].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "9px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px",
              background: activeTab === tab ? "#0f3460" : "white",
              color: activeTab === tab ? "white" : "#555",
              boxShadow: activeTab === tab ? "0 4px 12px rgba(15,52,96,0.3)" : "0 1px 4px rgba(0,0,0,0.08)"
            }}>{label}</button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: "40px", height: "40px", border: "4px solid #e0e0e0", borderTop: "4px solid #0f3460", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }}></div>
            <p style={{ color: "#888" }}>Loading your dashboard...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* No Store Assigned Error */}
        {!loading && error === "no_store" && (
          <div style={{ maxWidth: "480px", margin: "60px auto", textAlign: "center", background: "white", borderRadius: "20px", padding: "48px 40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🏪</div>
            <h4 style={{ fontWeight: 800, color: "#1a1a2e", marginBottom: "10px" }}>No Store Assigned Yet</h4>
            <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.6 }}>
              Your account is set up as a <strong>Store Owner</strong>, but no store has been linked to it yet.
            </p>
            <div style={{ background: "#fff8f0", border: "1px solid #ffe0b2", borderRadius: "12px", padding: "14px 18px", margin: "20px 0", textAlign: "left" }}>
              <p style={{ fontSize: "13px", color: "#b06000", margin: 0, lineHeight: 1.7 }}>
                👉 Ask the <strong>Admin</strong> to go to:<br />
                Admin Dashboard → <strong>➕ Add Store</strong> → Select your account as the owner
              </p>
            </div>
            <button onClick={fetchAll} style={{ background: "#0f3460", color: "white", border: "none", padding: "11px 28px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
              🔄 Retry
            </button>
          </div>
        )}

        {/* Dashboard Tab */}
        {!loading && !error && activeTab === "dashboard" && dashboard && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "28px" }}>
              {[
                { label: "Store Name", value: dashboard.storeName, icon: "🏪", color: "#0f3460" },
                { label: "Total Ratings", value: dashboard.totalRatings, icon: "📝", color: "#667eea" },
                { label: "Average Rating", value: dashboard.averageRating + " / 5", icon: "⭐", color: "#f7971e" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderBottom: `4px solid ${color}` }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>{icon}</div>
                  <div style={{ fontSize: "12px", color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{label}</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color }}>{value}</div>
                  {label === "Average Rating" && <StarDisplay value={dashboard.averageRating} />}
                </div>
              ))}
            </div>

            {/* Rating Distribution */}
            {dashboard.totalRatings > 0 && (
              <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <h6 style={{ fontWeight: 700, marginBottom: "20px", color: "#1a1a2e" }}>Rating Distribution</h6>
                {ratingDistribution.map(({ star, count }) => (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
                    <span style={{ color: "#f7971e", width: "30px", fontWeight: 700 }}>{star}★</span>
                    <div style={{ flex: 1, background: "#f0f0f0", borderRadius: "99px", height: "14px", overflow: "hidden" }}>
                      <div style={{ width: `${(count / maxCount) * 100}%`, background: "linear-gradient(90deg, #f7971e, #ffd200)", height: "100%", borderRadius: "99px", transition: "width 0.5s ease" }}></div>
                    </div>
                    <span style={{ color: "#999", fontSize: "13px", width: "25px" }}>{count}</span>
                  </div>
                ))}
              </div>
            )}

            {dashboard.totalRatings === 0 && (
              <div style={{ background: "white", borderRadius: "16px", padding: "40px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>⭐</div>
                <p style={{ color: "#888" }}>No ratings yet. Share your store link to get your first review!</p>
              </div>
            )}
          </div>
        )}

        {/* Store Tab */}
        {!loading && !error && activeTab === "store" && store && (
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <div style={{ background: "white", borderRadius: "20px", padding: "48px 40px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", textAlign: "center" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏪</div>
              <h3 style={{ fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>{store.name}</h3>
              <p style={{ color: "#aaa", marginBottom: "28px" }}>Your Store</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
                {[["📧 Email", store.email], ["📍 Address", store.address], ["🆔 Store ID", `#${store.id}`]].map(([label, val]) => (
                  <div key={label} style={{ background: "#f8f9fa", borderRadius: "12px", padding: "14px 18px" }}>
                    <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ratings Tab */}
        {!loading && !error && activeTab === "ratings" && (
          <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "10px" }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Customer Ratings</h5>
              <span style={{ background: "#f0f0f0", color: "#666", fontSize: "12px", padding: "3px 10px", borderRadius: "99px", fontWeight: 600 }}>{ratings.length}</span>
            </div>
            {ratings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                No ratings yet.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8f9fa" }}>
                      {["Customer", "Email", "Rating", "Date"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map(r => (
                      <tr key={r.id} style={{ borderTop: "1px solid #f5f5f5" }}>
                        <td style={{ padding: "14px 20px", fontWeight: 600 }}>{r.User?.name || "—"}</td>
                        <td style={{ padding: "14px 20px", color: "#888", fontSize: "13px" }}>{r.User?.email || "—"}</td>
                        <td style={{ padding: "14px 20px" }}><StarDisplay value={r.rating} /><span style={{ color: "#aaa", fontSize: "12px", marginLeft: "6px" }}>({r.rating}/5)</span></td>
                        <td style={{ padding: "14px 20px", color: "#aaa", fontSize: "13px" }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;
