import React, { useState } from "react";
import { Link } from "react-router-dom";
// Using your custom api instance
import api from "../../api/axios"; 
import { MdOutlineMail, MdErrorOutline, MdCheckCircle, MdChevronLeft } from "react-icons/md";
import { FiLoader } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // This state holds the 'identifier' (email or phone)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // The backend uses 'identifier' to detect if it's SMS or Email
      const response = await api.post("/auth/forgot-password", { identifier: email });
      setMessage(response.data.message || "Instructions sent! Check your email or phone.");
    } catch (err) {
      setError(err.response?.data?.error || "Account not found or network failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="level-up-card">
        <div className="farmer-icon">🔑</div>
        <h2 className="form-title">Account Recovery</h2>
        <p className="form-subtitle">Enter your Email or Phone to receive a reset link</p>

        {message && (
          <div className="alert-box success" style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', border: '1px solid #c8e6c9' }}>
            <MdCheckCircle /> {message}
          </div>
        )}
        
        {error && <div className="alert-box error"><MdErrorOutline /> {error}</div>}

        {!message && (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label"><MdOutlineMail /> Registered Identifier</label>
              <input 
                className="farmer-input" 
                type="text" // Changed to text to allow phone numbers
                placeholder="Email or Phone Number" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                autoComplete="username"
              />
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? <FiLoader className="spinner" /> : "Request Reset"}
            </button>
          </form>
        )}

        <div className="form-footer">
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <MdChevronLeft /> Back to Login
          </Link>
        </div>
      </div>

      <style>{`
        .register-page-wrapper {
          background-color: #1b4d3e; min-height: 100vh; width: 100vw;
          display: flex; justify-content: center; align-items: center;
          font-family: 'Segoe UI', sans-serif; padding: 20px; box-sizing: border-box;
        }
        .level-up-card {
          background: #fff; padding: 40px; border-radius: 24px; width: 100%; max-width: 450px;
          box-shadow: 0 20px 60px rgba(0,0,0,.4); border-top: 8px solid #fb8c00; text-align: center;
        }
        .farmer-icon { font-size: 50px; margin-bottom: 10px; }
        .form-title { color: #1b4d3e; font-size: 24px; font-weight: 800; margin: 0; }
        .form-subtitle { color: #666; font-size: 15px; margin-bottom: 25px; font-weight: 600; }
        .input-group { text-align: left; margin-bottom: 20px; }
        .input-label { font-weight: 700; color: #444; margin-bottom: 8px; font-size: 13px; display: flex; align-items: center; gap: 5px; }
        .farmer-input { width: 100%; padding: 14px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 16px; }
        .login-submit-btn { 
          width: 100%; padding: 16px; background: #fb8c00; color: #fff; border: none; border-radius: 12px; 
          cursor: pointer; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .alert-box.error { background: #ffebee; color: #c62828; padding: 12px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; border: 1px solid #ffcdd2; }
        .form-footer { margin-top: 25px; font-size: 14px; }
        .form-footer a { color: #fb8c00; font-weight: 700; text-decoration: none; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
