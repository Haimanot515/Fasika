import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { 
  MdSecurity, 
  MdLockOutline, 
  MdErrorOutline, 
  MdCheckCircle, 
  MdChevronLeft, 
  MdVerifiedUser 
} from "react-icons/md";
import { FiLoader, FiArrowLeft } from "react-icons/fi";
import { RiShieldKeyholeLine } from "react-icons/ri";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 8) return setError("Security policy: Minimum 8 characters required");

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { 
        token, 
        new_password: password 
      });

      setIsSuccess(true);
      
      // Dramatic redirect delay to show success state
      setTimeout(() => navigate("/login"), 3500);
    } catch (err) {
      setError(err.response?.data?.error || "Token expired or handshake failed.");
      setLoading(false);
    }
  };

  return (
    <div className="login-full-width-wrapper">
      <div className="level-up-card">
        {!isSuccess ? (
          <div className="step-fade">
            <div className="farmer-icon" style={{ color: '#2e7d32' }}>
              <RiShieldKeyholeLine style={{ fontSize: '50px' }} />
            </div>
            <h2 className="form-title">Security Update</h2>
            <p className="form-subtitle">Resetting credentials for your secure node.</p>

            {error && <div className="alert error-alert"><MdErrorOutline /> {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label"><MdSecurity /> New Password</label>
                <input 
                  className="farmer-input" 
                  type="password" 
                  placeholder="Enter new password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <div className="input-group" style={{ marginTop: '15px' }}>
                <label className="input-label"><MdLockOutline /> Confirm Password</label>
                <input 
                  className="farmer-input" 
                  type="password" 
                  placeholder="Repeat new password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading || !token}>
                {loading ? <FiLoader className="spinner" /> : "Authorize Password Reset"}
              </button>
            </form>
          </div>
        ) : (
          <div className="success-acclamation">
            <div className="celebration-ring">
              <MdVerifiedUser className="verified-icon" />
            </div>
            <h2 className="form-title">Update Complete</h2>
            <p className="form-subtitle">Your credentials have been encrypted and saved.</p>
            <div className="loading-bar-minimal">
              <div className="loading-fill"></div>
            </div>
            <p className="redirect-text">Re-routing to gateway login...</p>
          </div>
        )}

        <div className="footer-container">
          <Link to="/login" className="back-to-login"><FiArrowLeft /> Back to Login</Link>
        </div>
      </div>

      <style>{`
        .login-full-width-wrapper {
          background-color: #1b4d3e; min-height: 100vh; width: 100%;
          display: flex; justify-content: center; align-items: center;
          font-family: 'Segoe UI', sans-serif; padding: 20px; box-sizing: border-box;
        }
        .level-up-card {
          background: #fff; padding: 40px; border-radius: 24px; width: 100%; max-width: 480px;
          box-shadow: 0 20px 60px rgba(0,0,0,.4); border-top: 8px solid #fb8c00; text-align: center;
        }
        .farmer-icon { margin-bottom: 15px; }
        .form-title { color: #1b4d3e; font-size: 26px; font-weight: 800; margin-bottom: 5px; }
        .form-subtitle { color: #666; font-size: 14px; margin-bottom: 25px; }
        .input-group { text-align: left; }
        .input-label { display: block; font-weight: 700; color: #444; margin-bottom: 8px; font-size: 14px; display: flex; align-items: center; gap: 5px; }
        .farmer-input { 
          width: 100%; padding: 15px; border: 2px solid #eee; border-radius: 12px; 
          box-sizing: border-box; font-size: 16px; transition: border-color 0.3s;
        }
        .farmer-input:focus { border-color: #fb8c00; outline: none; }
        .alert { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 8px; margin-top: 20px; font-weight: 600; }
        .error-alert { color: #c62828; background: #ffebee; border: 1px solid #ffcdd2; }
        .login-submit-btn {
          width: 100%; padding: 16px; background: #2e7d32; color: #fff; border: none; 
          border-radius: 12px; cursor: pointer; font-size: 18px; font-weight: 700;
          margin-top: 25px; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s;
        }
        .login-submit-btn:hover:not(:disabled) { background: #1b4d3e; transform: translateY(-2px); }
        .login-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .footer-container { margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        .back-to-login { color: #fb8c00; text-decoration: none; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 5px; }
        
        /* Success State Styling */
        .success-acclamation { padding: 20px 0; animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .celebration-ring { 
          width: 80px; height: 80px; background: #e8f5e9; border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
          border: 4px solid #2e7d32; color: #2e7d32;
        }
        .verified-icon { font-size: 45px; }
        .loading-bar-minimal { height: 4px; width: 150px; background: #eee; margin: 20px auto; border-radius: 10px; overflow: hidden; }
        .loading-fill { height: 100%; background: #fb8c00; animation: fill 3.5s linear forwards; }
        .redirect-text { font-size: 12px; color: #888; font-weight: 600; }

        @keyframes fill { from { width: 0%; } to { width: 100%; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .step-fade { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ResetPassword;
