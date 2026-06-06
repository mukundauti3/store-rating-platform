import { useState } from "react";
import api from "../services/api";
import Signup from "./Signup";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) return <Signup onBack={() => setShowSignup(false)} />;

  const login = async () => {
    if (!email || !password) { setError("Please enter email and password."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  // // Demo credentials helper
  // const fillDemo = (role) => {
  //   const demos = {
  //     ADMIN: { email: "admin@demo.com", password: "Admin@123" },
  //     STORE_OWNER: { email: "owner@demo.com", password: "Owner@123" },
  //     USER: { email: "user@demo.com", password: "User@123" },
  //   };
  //   setEmail(demos[role].email);
  //   setPassword(demos[role].password);
  //   setError("");
  // };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "20px"
    }}>
      {/* Decorative blobs */}
      <div style={{ position:"fixed", top:"-100px", right:"-100px", width:"400px", height:"400px", borderRadius:"50%", background:"rgba(233,69,96,0.08)", pointerEvents:"none" }}></div>
      <div style={{ position:"fixed", bottom:"-80px", left:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(102,126,234,0.08)", pointerEvents:"none" }}></div>

      <div style={{ background:"white", borderRadius:"24px", padding:"44px 40px", width:"100%", maxWidth:"440px", boxShadow:"0 25px 60px rgba(0,0,0,0.4)" }}>

        {/* Brand */}
        <div className="text-center mb-4">
          <div style={{ width:"64px", height:"64px", borderRadius:"16px", background:"linear-gradient(135deg, #0f3460, #e94560)", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"28px", marginBottom:"14px", boxShadow:"0 8px 24px rgba(15,52,96,0.3)" }}>⭐</div>
          <h3 style={{ fontWeight:800, color:"#1a1a2e", marginBottom:"4px", fontSize:"26px" }}>StoreRater</h3>
          <p style={{ color:"#888", fontSize:"14px", margin:0 }}>Sign in to your account</p>
        </div>

        {/* Role Access Info
        <div style={{ background:"#f8f9ff", border:"1px solid #e0e5ff", borderRadius:"14px", padding:"14px 16px", marginBottom:"20px" }}>
          <p style={{ fontSize:"12px", fontWeight:700, color:"#0f3460", margin:"0 0 10px", textTransform:"uppercase", letterSpacing:"0.5px" }}>🔐 Role-Based Access</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
            {[
              ["🔴", "ADMIN", "#e94560", "Manage users, stores & view stats"],
              ["🟠", "STORE OWNER", "#f7971e", "View your store ratings & analytics"],
              ["🟣", "USER", "#667eea", "Browse stores & submit ratings"],
            ].map(([icon, role, color, desc]) => (
              <div key={role} style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer", padding:"6px 8px", borderRadius:"8px", transition:"background 0.15s" }}
                onClick={() => fillDemo(role.replace(" ", "_"))}
                onMouseEnter={e => e.currentTarget.style.background = color + "15"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                title="Click to auto-fill demo credentials">
                <span style={{ fontSize:"16px" }}>{icon}</span>
                <div>
                  <span style={{ fontSize:"12px", fontWeight:700, color }}>{role}</span>
                  <span style={{ fontSize:"11px", color:"#888", marginLeft:"6px" }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize:"11px", color:"#aaa", margin:"8px 0 0", textAlign:"center" }}>💡 Click a role above to auto-fill demo credentials</p>
        </div> */}

        {/* Error */}
        {error && (
          <div style={{ background:"#fff0f3", border:"1px solid #ffb3c1", borderRadius:"10px", padding:"10px 14px", color:"#c0392b", fontSize:"13px", marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom:"16px" }}>
          <label style={{ display:"block", fontSize:"12px", fontWeight:700, color:"#444", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Email Address</label>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width:"100%", padding:"12px 16px", border:"2px solid #e8e8e8", borderRadius:"12px", fontSize:"15px", outline:"none", background:"#fafafa", boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor = "#0f3460"}
            onBlur={e => e.target.style.borderColor = "#e8e8e8"} />
        </div>

        {/* Password */}
        <div style={{ marginBottom:"24px" }}>
          <label style={{ display:"block", fontSize:"12px", fontWeight:700, color:"#444", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Password</label>
          <input type="password" placeholder="Enter your password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width:"100%", padding:"12px 16px", border:"2px solid #e8e8e8", borderRadius:"12px", fontSize:"15px", outline:"none", background:"#fafafa", boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor = "#0f3460"}
            onBlur={e => e.target.style.borderColor = "#e8e8e8"} />
        </div>

        {/* Login Button */}
        <button onClick={login} disabled={loading}
          style={{ width:"100%", padding:"14px", background: loading ? "#aaa" : "linear-gradient(135deg, #0f3460, #e94560)", color:"white", border:"none", borderRadius:"12px", fontSize:"16px", fontWeight:700, cursor: loading ? "not-allowed" : "pointer", boxShadow:"0 6px 20px rgba(15,52,96,0.35)", letterSpacing:"0.3px" }}>
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", margin:"20px 0", gap:"12px" }}>
          <div style={{ flex:1, height:"1px", background:"#eee" }}></div>
          <span style={{ color:"#bbb", fontSize:"12px" }}>New here?</span>
          <div style={{ flex:1, height:"1px", background:"#eee" }}></div>
        </div>

        {/* Sign Up Link */}
        <button onClick={() => setShowSignup(true)}
          style={{ width:"100%", padding:"13px", background:"transparent", color:"#0f3460", border:"2px solid #0f3460", borderRadius:"12px", fontSize:"15px", fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}
          onMouseEnter={e => { e.target.style.background="#0f3460"; e.target.style.color="white"; }}
          onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.color="#0f3460"; }}>
          Create New Account
        </button>
      </div>
    </div>
  );
}

export default Login;
