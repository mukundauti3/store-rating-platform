import { useState } from "react";
import api from "../services/api";

function Signup({ onBack }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    const { name, email, password, address } = form;
    if (!name || !email || !password) { setError("Name, email and password are required."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(password)) { setError("Password must contain at least one uppercase letter."); return; }
    if (!/[!@#$%^&*]/.test(password)) { setError("Password must contain at least one special character (!@#$%^&*)."); return; }

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password, address });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI', system-ui, sans-serif", padding:"20px" }}>
        <div style={{ background:"white", borderRadius:"24px", padding:"48px 40px", width:"100%", maxWidth:"420px", boxShadow:"0 25px 60px rgba(0,0,0,0.4)", textAlign:"center" }}>
          <div style={{ fontSize:"64px", marginBottom:"16px" }}>🎉</div>
          <h3 style={{ fontWeight:800, color:"#1a1a2e", marginBottom:"8px" }}>Account Created!</h3>
          <p style={{ color:"#666", marginBottom:"8px" }}>Welcome to StoreRater, <strong>{form.name}</strong>!</p>
          <p style={{ color:"#888", fontSize:"14px", marginBottom:"28px" }}>
            You've been registered as a <span style={{ color:"#667eea", fontWeight:700 }}>USER</span>.
            An admin can upgrade your role if needed.
          </p>
          <button onClick={onBack}
            style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg, #0f3460, #e94560)", color:"white", border:"none", borderRadius:"12px", fontSize:"16px", fontWeight:700, cursor:"pointer", boxShadow:"0 6px 20px rgba(15,52,96,0.35)" }}>
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI', system-ui, sans-serif", padding:"20px" }}>
      <div style={{ background:"white", borderRadius:"24px", padding:"44px 40px", width:"100%", maxWidth:"440px", boxShadow:"0 25px 60px rgba(0,0,0,0.4)" }}>

        {/* Back Button */}
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:"14px", padding:0, marginBottom:"20px", display:"flex", alignItems:"center", gap:"6px" }}>
          ← Back to Login
        </button>

        {/* Brand */}
        <div className="text-center mb-4">
          <div style={{ width:"64px", height:"64px", borderRadius:"16px", background:"linear-gradient(135deg, #0f3460, #e94560)", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"28px", marginBottom:"14px", boxShadow:"0 8px 24px rgba(15,52,96,0.3)" }}>⭐</div>
          <h3 style={{ fontWeight:800, color:"#1a1a2e", marginBottom:"4px", fontSize:"26px" }}>Create Account</h3>
          <p style={{ color:"#888", fontSize:"14px", margin:0 }}>Join StoreRater as a User</p>
        </div>

        {/* Note about roles */}
        <div style={{ background:"#fff8f0", border:"1px solid #ffe0b2", borderRadius:"12px", padding:"12px 14px", marginBottom:"20px", fontSize:"13px", color:"#b06000" }}>
          📌 Public signup creates a <strong>USER</strong> account. ADMIN or STORE OWNER roles must be assigned by an Admin.
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:"#fff0f3", border:"1px solid #ffb3c1", borderRadius:"10px", padding:"10px 14px", color:"#c0392b", fontSize:"13px", marginBottom:"16px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Fields */}
        {[
          { label: "Full Name", field: "name", type: "text", placeholder: "e.g. Mukund Auti" },
          { label: "Email Address", field: "email", type: "email", placeholder: "you@example.com" },
          { label: "Password", field: "password", type: "password", placeholder: "Min 8 chars, 1 uppercase, 1 special" },
          { label: "Address (Optional)", field: "address", type: "text", placeholder: "e.g. Pune, Maharashtra" },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field} style={{ marginBottom:"16px" }}>
            <label style={{ display:"block", fontSize:"12px", fontWeight:700, color:"#444", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</label>
            <input type={type} placeholder={placeholder} value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSignup()}
              style={{ width:"100%", padding:"12px 16px", border:"2px solid #e8e8e8", borderRadius:"12px", fontSize:"15px", outline:"none", background:"#fafafa", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = "#0f3460"}
              onBlur={e => e.target.style.borderColor = "#e8e8e8"} />
          </div>
        ))}

        {/* Password rules */}
        <div style={{ background:"#f8f9fa", borderRadius:"10px", padding:"10px 14px", marginBottom:"24px" }}>
          <p style={{ fontSize:"11px", color:"#888", fontWeight:700, margin:"0 0 6px", textTransform:"uppercase" }}>Password Requirements</p>
          {[
            [form.password.length >= 8, "At least 8 characters"],
            [/[A-Z]/.test(form.password), "At least 1 uppercase letter"],
            [/[!@#$%^&*]/.test(form.password), "At least 1 special character"],
          ].map(([met, text]) => (
            <div key={text} style={{ fontSize:"12px", color: met ? "#27ae60" : "#aaa", display:"flex", alignItems:"center", gap:"6px", marginBottom:"2px" }}>
              <span>{met ? "✅" : "○"}</span> {text}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button onClick={handleSignup} disabled={loading}
          style={{ width:"100%", padding:"14px", background: loading ? "#aaa" : "linear-gradient(135deg, #0f3460, #e94560)", color:"white", border:"none", borderRadius:"12px", fontSize:"16px", fontWeight:700, cursor: loading ? "not-allowed" : "pointer", boxShadow:"0 6px 20px rgba(15,52,96,0.35)" }}>
          {loading ? "Creating Account..." : "Create Account →"}
        </button>

        <p style={{ textAlign:"center", fontSize:"13px", color:"#aaa", marginTop:"20px", marginBottom:0 }}>
          Already have an account?{" "}
          <span onClick={onBack} style={{ color:"#0f3460", fontWeight:700, cursor:"pointer" }}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
