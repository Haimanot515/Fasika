import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Changed: using your custom api instance
import api from "../../api/axios"; 

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New state for success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Updated: Using the api instance with relative path
      const res = await api.post(
        "/auth/login-user",
        formData,
        { withCredentials: true }
      );

      if (res.data.authenticated) {
        setSuccess("Login Successful! Entering Marketplace...");
        
        const roles = Array.isArray(res.data.role) ? res.data.role : [res.data.role];
        localStorage.setItem("role", JSON.stringify(roles));
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("isAuthenticated", "true");

        if (onLogin) onLogin(roles);

        // Small delay so they can see the success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Login Failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-full-width-wrapper">
      <div className="login-container">
        <form className="auth-form level-up-card" onSubmit={handleSubmit}>
          <div className="farmer-icon">🌱</div>
          <h2 className="form-title">Welcome to Login Portal</h2>
          <p className="form-subtitle">Secure Access to Your Digital Farm</p>

          {/* Success Box */}
          {success && <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "12px", borderRadius: "10px", marginBottom: "15px", fontWeight: "600" }}>{success}</div>}

          {/* Error Box */}
          {error && <div style={{ background: "#ffebee", color: "#c62828", padding: "12px", borderRadius: "10px", marginBottom: "15px", fontWeight: "600" }}>{error}</div>}

          <div className="input-group">
            <label className="input-label">Email or Phone</label>
            <input className="farmer-input" name="identifier" placeholder="e.g. 0911..." value={formData.identifier} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="farmer-input" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Verifying..." : "Enter Marketplace"}
          </button>

          <div className="form-footer">
            <Link to="/forgot-password">Forgot Password?</Link>
            <span className="register-link">New? <Link to="/register">Create Account</Link></span>
          </div>
        </form>
      </div>
      <style>{`.login-full-width-wrapper{background-color:#1b4d3e;min-height:100vh;max-width:100%;display:flex;justify-content:center;align-items:center;font-family:'Segoe UI',sans-serif;overflow-x:hidden}.level-up-card{background:#fff;padding:40px;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.3);border-top:8px solid #fb8c00;text-align:center;width:400px;max-width:90%}.form-title{color:#1b4d3e;font-size:24px;font-weight:800;margin-bottom:5px}.input-group{text-align:left;margin-bottom:20px}.input-label{display:block;font-weight:700;color:#444;margin-bottom:8px;font-size:14px}.farmer-input{width:100%;padding:15px;border:2px solid #eee;border-radius:12px;box-sizing:border-box;font-size:16px}.login-submit-btn{width:100%;padding:16px;background:#fb8c00;color:#fff;border:none;border-radius:12px;cursor:pointer;font-size:18px;font-weight:700}.login-submit-btn:hover{background:#ef6c00}.form-footer{margin-top:20px;display:flex;justify-content:space-between;font-size:14px}.form-footer a{color:#fb8c00;text-decoration:none;font-weight:600}`}</style>
    </div>
  );
};

export default LoginForm;
