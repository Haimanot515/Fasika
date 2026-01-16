
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
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaShoppingCart, FaCaretDown } from "react-icons/fa";
// 1. Your imported page
import DraggablePromotionPage from "../../pages/dashboard/BuyerPromotionPage";

const BuyerTopNavbar = () => {
  const [region, setRegion] = useState("Addis Ababa");
  // 2. Toggle State
  const [showPromo, setShowPromo] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav style={amazonStyles.navbar}>
        <style>{`
          .nav-hover:hover { border: 1px solid #fff !important; border-radius: 2px; }
          .search-focus:focus-within { box-shadow: 0 0 0 2px #f08804; }
          .logo-btn { cursor: pointer; user-select: none; }
        `}</style>

        {/* 3. Logo - Clicking this now toggles showPromo */}
        <div 
          onClick={() => setShowPromo(!showPromo)} 
          className="nav-hover logo-btn" 
          style={amazonStyles.logo}
        >
          fasika<span style={{ color: "#febd69" }}>.et</span>
        </div>

        {/* 2. Deliver To Section */}
        <div className="nav-hover" style={amazonStyles.navSection}>
          <FaMapMarkerAlt style={amazonStyles.locationIcon} />
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Deliver to</span>
            <span style={amazonStyles.lineTwo}>{region}</span>
          </div>
        </div>

        {/* 3. Search Bar */}
        <div className="search-focus" style={amazonStyles.searchContainer}>
          <div style={amazonStyles.searchCategory}>
            <select style={amazonStyles.categorySelect}>
              <option>All</option>
              <option>Livestock</option>
              <option>Grains</option>
              <option>Vegetables</option>
            </select>
            <FaCaretDown style={amazonStyles.caretIcon} />
          </div>
          <input
            type="text"
            style={amazonStyles.searchInput}
            placeholder="Search for bulls, teff, or honey..."
          />
          <button style={amazonStyles.searchButton}>
            <FaSearch style={{ fontSize: "18px" }} />
          </button>
        </div>

        {/* 4. Accounts & Lists */}
        <div className="nav-hover" style={amazonStyles.navSection}>
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Hello, User</span>
            <span style={amazonStyles.lineTwo}>
              Account & Lists <FaCaretDown style={{ fontSize: "10px" }} />
            </span>
          </div>
        </div>

        {/* 5. Returns & Orders */}
        <Link to="/orders" className="nav-hover" style={amazonStyles.navSectionLink}>
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Returns</span>
            <span style={amazonStyles.lineTwo}>& Orders</span>
          </div>
        </Link>

        {/* 6. Cart */}
        <Link to="/cart" className="nav-hover" style={amazonStyles.cartSection}>
          <div style={{ position: "relative" }}>
            <FaShoppingCart style={{ fontSize: "32px" }} />
            <span style={amazonStyles.cartCount}>3</span>
          </div>
          <span style={{ ...amazonStyles.lineTwo, marginTop: "12px" }}>Cart</span>
        </Link>
      </nav>

      {/* 4. The Toggled Promotion Page Overlay */}
      {showPromo && (
        <div style={overlayStyles.wrapper}>
          <div style={overlayStyles.header}>
            <span>Marketplace Promotions</span>
            <button 
                style={overlayStyles.closeBtn} 
                onClick={() => setShowPromo(false)}
            >
                CLOSE [DROP]
            </button>
          </div>
          <DraggablePromotionPage />
        </div>
      )}
    </>
  );
};

const overlayStyles = {
    wrapper: {
        position: 'fixed',
        top: '60px',
        left: 0,
        width: '100%',
        height: 'calc(100vh - 60px)',
        zIndex: 15000,
        backgroundColor: '#f0f2f2',
        overflowY: 'auto'
    },
    header: {
        background: '#232f3e',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    closeBtn: {
        background: '#e74c3c',
        border: 'none',
        color: 'white',
        padding: '5px 15px',
        borderRadius: '4px',
        cursor: 'pointer'
    }
}

const amazonStyles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#131921",
    padding: "8px 20px",
    gap: "15px",
    height: "60px",
    color: "#fff",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 11000,
  },
  logo: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    padding: "6px 12px",
    border: "1px solid transparent",
    transition: "0.1s",
  },
  navSection: {
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    cursor: "pointer",
    border: "1px solid transparent",
    gap: "2px",
  },
  navSectionLink: {
    textDecoration: "none",
    color: "#fff",
    padding: "6px 10px",
    border: "1px solid transparent",
  },
  locationIcon: {
    fontSize: "18px",
    marginTop: "8px",
    marginRight: "2px",
  },
  navTextContainer: {
    display: "flex",
    flexDirection: "column",
  },
  lineOne: {
    fontSize: "12px",
    color: "#ccc",
  },
  lineTwo: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  searchContainer: {
    display: "flex",
    flex: 1,
    height: "40px",
    borderRadius: "4px",
    overflow: "hidden",
    backgroundColor: "#fff",
    margin: "0 10px", 

  },
  searchCategory: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: "0 10px",
    borderRight: "1px solid #bbb",
    cursor: "pointer",
    position: "relative",
  },
  categorySelect: {
    appearance: "none",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "12px",
    color: "#555",
    paddingRight: "15px",
    outline: "none",
    cursor: "pointer",
  },
  caretIcon: {
    position: "absolute",
    right: "5px",
    fontSize: "10px",
    color: "#555",
  },
  searchInput: {
    flex: 1,
    border: "none",
    padding: "0 10px",
    outline: "none",
    fontSize: "15px",
  },
  searchButton: {
    backgroundColor: "#febd69",
    border: "none",
    width: "45px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
  },
  cartSection: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#fff",
    padding: "0 10px",
    gap: "5px",
    border: "1px solid transparent",
  },
  cartCount: {
    position: "absolute",
    top: "-5px",
    right: "10px",
    backgroundColor: "#131921",
    color: "#f08804",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "20px",
    textAlign: "center",
  },
};

export default BuyerTopNavbar;
