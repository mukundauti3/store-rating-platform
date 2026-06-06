import { useState, useEffect } from "react";
import api from "../services/api";

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          style={{
            fontSize: "22px",
            cursor: readOnly ? "default" : "pointer",
            color: star <= (hovered || value) ? "#f7971e" : "#ddd",
            transition: "color 0.15s"
          }}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >★</span>
      ))}
    </span>
  );
}

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("stores");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("name");

  // Rating modal state
  const [ratingModal, setRatingModal] = useState(null); // { store, existing }
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingMsg, setRatingMsg] = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [storesRes, ratingsRes] = await Promise.all([
        api.get("/user/stores"),
        api.get("/user/my-ratings"),
      ]);
      setStores(storesRes.data);
      setMyRatings(ratingsRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSearch = async () => {
    try {
      const res = await api.get(`/user/stores/search?${searchField}=${encodeURIComponent(search)}`);
      setStores(res.data);
    } catch (err) { console.error(err); }
  };

  const handleClearSearch = async () => {
    setSearch("");
    const res = await api.get("/user/stores");
    setStores(res.data);
  };

  const openRatingModal = (store) => {
    const existing = myRatings.find(r => r.storeId === store.id);
    setRatingValue(existing ? existing.rating : 0);
    setRatingMsg("");
    setRatingModal({ store, existing });
  };

  const handleSubmitRating = async () => {
    if (!ratingValue) { setRatingMsg("Please select a star rating."); return; }
    setRatingMsg("");
    try {
      if (ratingModal.existing) {
        await api.put(`/user/rate/${ratingModal.store.id}`, { rating: ratingValue });
        setRatingMsg("✅ Rating updated!");
      } else {
        await api.post("/user/rate", { storeId: ratingModal.store.id, rating: ratingValue });
        setRatingMsg("✅ Rating submitted!");
      }
      await fetchAll();
      setTimeout(() => setRatingModal(null), 1000);
    } catch (err) {
      setRatingMsg("❌ " + (err.response?.data?.message || "Error submitting rating"));
    }
  };

  const getMyRatingForStore = (storeId) => {
    const r = myRatings.find(r => r.storeId === storeId);
    return r ? r.rating : null;
  };

  const handleLogout = () => { localStorage.clear(); window.location.reload(); };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Navbar */}
      <nav className="navbar navbar-dark" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "12px 24px" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold fs-5 mb-0">
            <span style={{ color: "#56ab2f" }}>●</span> StoreRater <span className="badge ms-2" style={{ background: "#56ab2f", fontSize: "11px" }}>USER</span>
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container-fluid py-4 px-4">
        {/* Tabs */}
        <ul className="nav nav-pills mb-4" style={{ gap: "8px" }}>
          {[["stores", "🏪 Browse Stores"], ["my-ratings", "⭐ My Ratings"]].map(([tab, label]) => (
            <li className="nav-item" key={tab}>
              <button className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? { background: "#0f3460", color: "white" } : { color: "#444" }}>{label}</button>
            </li>
          ))}
        </ul>

        {loading && <div className="text-center py-5"><div className="spinner-border" style={{ color: "#0f3460" }}></div></div>}

        {/* Stores Tab */}
        {!loading && activeTab === "stores" && (
          <>
            {/* Search bar */}
            <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: "14px" }}>
              <div className="row g-2 align-items-center">
                <div className="col-md-3">
                  <select className="form-select" value={searchField} onChange={e => setSearchField(e.target.value)}>
                    <option value="name">Search by Name</option>
                    <option value="address">Search by Address</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Type to search..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()} />
                </div>
                <div className="col-md-3 d-flex gap-2">
                  <button className="btn text-white fw-semibold" style={{ background: "#0f3460" }} onClick={handleSearch}>Search</button>
                  <button className="btn btn-outline-secondary" onClick={handleClearSearch}>Clear</button>
                </div>
              </div>
            </div>

            <div className="row g-3">
              {stores.length === 0 && <div className="col-12 text-center py-5 text-muted">No stores found.</div>}
              {stores.map(store => {
                const myRating = getMyRatingForStore(store.id);
                return (
                  <div className="col-md-4 col-lg-3" key={store.id}>
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px", transition: "transform 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0">{store.name}</h6>
                          <span style={{ fontSize: "20px" }}>🏪</span>
                        </div>
                        <p className="text-muted small mb-3">{store.address}</p>
                        <p className="text-muted small mb-3">{store.email}</p>
                        {myRating ? (
                          <div className="mb-3">
                            <small className="text-success fw-semibold">Your rating:</small><br />
                            <StarRating value={myRating} readOnly />
                          </div>
                        ) : (
                          <p className="text-muted small mb-3">Not rated yet</p>
                        )}
                        <button
                          className="btn w-100 btn-sm fw-semibold text-white"
                          style={{ background: myRating ? "#f7971e" : "#56ab2f", borderRadius: "8px" }}
                          onClick={() => openRatingModal(store)}
                        >
                          {myRating ? "Update Rating" : "Rate Store"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* My Ratings Tab */}
        {!loading && activeTab === "my-ratings" && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-header border-0 bg-white pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">My Ratings <span className="badge bg-secondary ms-2">{myRatings.length}</span></h5>
            </div>
            <div className="card-body p-0">
              {myRatings.length === 0 ? (
                <div className="text-center py-5 text-muted">You haven't rated any stores yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: "#f8f9fa" }}>
                      <tr>
                        <th className="px-4 py-3 border-0">Store</th>
                        <th className="py-3 border-0">Address</th>
                        <th className="py-3 border-0">Your Rating</th>
                        <th className="py-3 border-0">Date</th>
                        <th className="py-3 border-0">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myRatings.map(r => (
                        <tr key={r.id}>
                          <td className="px-4 py-3 fw-semibold">{r.Store?.name || "—"}</td>
                          <td className="py-3 text-muted small">{r.Store?.address || "—"}</td>
                          <td className="py-3"><StarRating value={r.rating} readOnly /></td>
                          <td className="py-3 text-muted small">{new Date(r.createdAt).toLocaleDateString()}</td>
                          <td className="py-3">
                            <button className="btn btn-sm btn-outline-warning" onClick={() => {
                              const store = stores.find(s => s.id === r.storeId) || { id: r.storeId, name: r.Store?.name };
                              openRatingModal(store);
                            }}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: "20px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{ratingModal.existing ? "Update Rating" : "Rate Store"}</h5>
                <button className="btn-close" onClick={() => setRatingModal(null)}></button>
              </div>
              <div className="modal-body py-4 text-center">
                <p className="fw-semibold fs-5 mb-1">{ratingModal.store?.name}</p>
                <p className="text-muted small mb-4">{ratingModal.store?.address}</p>
                <div className="mb-3" style={{ fontSize: "32px" }}>
                  <StarRating value={ratingValue} onChange={setRatingValue} />
                </div>
                <p className="text-muted small">{ratingValue ? `${ratingValue} / 5 stars` : "Click to select rating"}</p>
                {ratingMsg && <div className={`alert ${ratingMsg.startsWith("✅") ? "alert-success" : "alert-danger"} py-2 mt-3`}>{ratingMsg}</div>}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light" onClick={() => setRatingModal(null)}>Cancel</button>
                <button className="btn text-white fw-semibold px-4" style={{ background: "#0f3460", borderRadius: "8px" }} onClick={handleSubmitRating}>
                  {ratingModal.existing ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
