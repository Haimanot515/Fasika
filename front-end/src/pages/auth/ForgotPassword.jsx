import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Extreme Level Icons
import { MdVpnKey, MdOutlineMailOutline, MdErrorOutline, MdCheckCircle, MdSend } from "react-icons/md";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { 
        identifier 
      });
      
      setSuccess(res.data.message || "Reset link sent successfully!");
      setIsSent(true);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError("Too many requests. Please wait a moment.");
      } else {
        setError(err.response?.data?.error || "Request failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-full-width-wrapper">
      <div className="login-container">
        <form className="auth-form level-up-card" onSubmit={handleSubmit}>
          
          {/* Extreme Icon Header */}
          <div className="farmer-icon" style={{ color: isSent ? '#2e7d32' : '#fb8c00', fontSize: '50px', marginBottom: '10px' }}>
            {isSent ? <MdCheckCircle /> : <RiLockPasswordLine />}
          </div>
          
          <h2 className="form-title">{isSent ? "Check Inbox" : "Recovery"}</h2>
          <p className="form-subtitle">
            {isSent ? "A secure link has been dispatched." : "Recover your digital farm access."}
          </p>

          {/* Alert Messages */}
          {success && <div className="alert-box success"><MdCheckCircle /> {success}</div>}
          {error && <div className="alert-box error"><MdErrorOutline /> {error}</div>}

          {!isSent ? (
            <>
              <div className="input-group">
                <label className="input-label">
                  <MdOutlineMailOutline style={{ verticalAlign: 'middle', marginRight: '5px' }} /> 
                  Email or Phone
                </label>
                <input 
                  className="farmer-input" 
                  placeholder="Enter registered contact" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner-container"><FiLoader className="spinner" /> Sending...</span>
                ) : (
                  <span className="btn-content">Send Reset Link <MdSend /></span>
                )}
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setIsSent(false)} className="login-submit-btn" style={{ background: '#1b4d3e' }}>
               Try Different Email
            </button>
          )}

          <div className="form-footer">
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FiArrowLeft /> Back to Login
            </Link>
          </div>
        </form>
      </div>

      <style>{`
        .login-full-width-wrapper {
          background-color: #1b4d3e;
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Segoe UI', sans-serif;
          overflow-x: hidden;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        .login-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .level-up-card {
          background: #fff;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,.4);
          border-top: 8px solid #fb8c00;
          text-align: center;
          width: 100%;
          max-width: 400px;
        }
        .form-title { color: #1b4d3e; font-size: 26px; font-weight: 800; margin-bottom: 5px; }
        .form-subtitle { color: #666; font-size: 14px; margin-bottom: 25px; }
        .input-group { text-align: left; margin-bottom: 20px; }
        .input-label { display: block; font-weight: 700; color: #444; margin-bottom: 8px; font-size: 14px; }
        .farmer-input { 
          width: 100%; padding: 15px; border: 2px solid #eee; border-radius: 12px; 
          box-sizing: border-box; font-size: 16px; transition: border-color 0.3s;
        }
        .farmer-input:focus { border-color: #fb8c00; outline: none; }
        
        .alert-box {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px; border-radius: 10px; margin-bottom: 15px; font-weight: 600; font-size: 13px;
        }
        .success { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
        .error { background: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }

        .login-submit-btn {
          width: 100%; padding: 16px; background: #fb8c00; color: #fff; border: none; 
          border-radius: 12px; cursor: pointer; font-size: 18px; font-weight: 700;
          transition: transform 0.2s, background 0.2s; margin-top: 10px;
        }
        .login-submit-btn:hover:not(:disabled) { background: #ef6c00; transform: translateY(-2px); }
        .login-submit-btn:disabled { background: #ccc; cursor: not-allowed; }
        
        .btn-content, .spinner-container { display: flex; align-items: center; justify-content: center; gap: 10px; }
        
        .spinner { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .form-footer { margin-top: 25px; display: flex; justify-content: center; font-size: 14px; }
        .form-footer a { color: #2e7d32; text-decoration: none; font-weight: 700; transition: color 0.2s; }
        .form-footer a:hover { color: #fb8c00; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;