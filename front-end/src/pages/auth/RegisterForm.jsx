import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Using your custom api instance
import api from "../../api/axios"; 
import Select from "react-select";
import ReCAPTCHA from "react-google-recaptcha"; // Added Captcha Import

// Advanced Farmer-Friendly Icons
import { 
  MdOutlinePersonOutline, 
  MdPhoneIphone, 
  MdOutlineMail, 
  MdLocationOn, 
  MdSecurity, 
  MdCheckCircle, 
  MdChevronRight, 
  MdChevronLeft,
  MdErrorOutline,
  MdOutlineAssignmentTurnedIn,
  MdVerifiedUser
} from "react-icons/md";
import { FiLoader, FiUserCheck, FiShield } from "react-icons/fi";
import { RiSeedlingLine, RiUserSearchLine } from "react-icons/ri";

import ethiopiaData from "../../data/ethiopia.json";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); 
  const [captchaToken, setCaptchaToken] = useState(null); // Added Captcha State

  const [formData, setFormData] = useState({
    full_name: "", phone: "", email: "", password: "", confirmPassword: "",
    role: "farmer", region: "", zone: "", woreda: "", kebele: "",
    preferred_method: "EMAIL", 
    terms_accepted: false, privacy_accepted: false,
    platform_rules_accepted: false, communication_consent: true,
  });

  const [zones, setZones] = useState([]);
  const [woredas, setWoredas] = useState([]);

  /* ---------------- Validation Logic ---------------- */
  const validateStep = () => {
    setError("");
    if (currentStep === 1) {
      if (!formData.full_name || !formData.phone) {
        setError("Name and phone are required to continue.");
        return false;
      }
      const phoneRegex = /^(?:0|251|\+251)?9\d{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError("Please enter a valid Ethiopian phone number.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.region || !formData.zone || !formData.woreda || !formData.kebele) {
        setError("Please complete all location fields for accurate farm matching.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setCurrentStep((s) => s + 1);
  };

  /* ---------------- Event Handlers ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleRegionChange = (opt) => {
    const region = ethiopiaData.regions.find((r) => r.name === opt.value);
    setFormData((p) => ({ ...p, region: opt.value, zone: "", woreda: "" }));
    setZones(region?.zones || []);
    setWoredas([]);
  };

  const handleZoneChange = (opt) => {
    const zone = zones.find((z) => z.name === opt.value);
    setFormData((p) => ({ ...p, zone: opt.value, woreda: "" }));
    setWoredas(zone?.woredas || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    if (!formData.terms_accepted || !formData.privacy_accepted || !formData.platform_rules_accepted) {
      return setError("Please accept all agreements to create your account.");
    }
    if (!captchaToken) {
      return setError("Please complete the security check.");
    }

    setLoading(true);
    try {
      // Added captchaToken to the payload
      const payload = { 
        ...formData, 
        role: formData.role.toLowerCase(),
        captchaToken 
      };
      
      await api.post("/auth/register-user", payload);
      
      setIsRegistered(true); 

      setTimeout(() => {
        if (formData.preferred_method === "EMAIL") navigate("/login");
        else navigate("/verify-otp", { state: { phone: formData.phone } });
      }, 5000);

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
      setLoading(false);
      setCaptchaToken(null); // Reset captcha on error
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base, padding: '5px', borderRadius: '12px', border: '2px solid #eee', marginBottom: '15px',
      '&:hover': { borderColor: '#fb8c00' }
    })
  };

  return (
    <div className="register-page-wrapper">
      <div className="level-up-card">
        
        {!isRegistered ? (
          <>
            <div className="step-progress-container">
              {[1, 2, 3].map(step => (
                <div key={step} className={`step-dot ${currentStep >= step ? 'active' : ''}`}>
                  {currentStep > step ? <MdCheckCircle /> : step}
                </div>
              ))}
              <div className="progress-line" style={{ width: `${(currentStep - 1) * 50}%` }} />
            </div>

            <div className="farmer-icon"><RiSeedlingLine /></div>
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">
              {currentStep === 1 && "Personal details"}
              {currentStep === 2 && "Farm Location"}
              {currentStep === 3 && "Account Security"}
            </p>

            {error && <div className="alert-box error"><MdErrorOutline /> {error}</div>}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="step-content">
                  <div className="input-group">
                    <label className="input-label"><MdOutlinePersonOutline /> Full Name</label>
                    <input className="farmer-input" name="full_name" placeholder="Full name" value={formData.full_name} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label"><MdPhoneIphone /> Phone Number</label>
                    <input className="farmer-input" name="phone" placeholder="09..." value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label"><MdOutlineMail /> Email (Optional)</label>
                    <input className="farmer-input" name="email" placeholder="mail@example.com" value={formData.email} onChange={handleChange} />
                  </div>

                  <div className="method-selector">
                    <p className="small-label">Preferred Verification:</p>
                    <div className="radio-group">
                      {["SMS", "EMAIL"].map((m) => (
                        <label key={m} className={`radio-card ${formData.preferred_method === m ? 'selected' : ''}`}>
                          <input type="radio" name="preferred_method" value={m} checked={formData.preferred_method === m} onChange={handleChange} />
                          {m}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="button" onClick={nextStep} className="login-submit-btn">Next Step <MdChevronRight /></button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-content">
                  <div className="input-group">
                    <label className="input-label"><MdLocationOn /> Regional Details</label>
                    <Select styles={selectStyles} options={ethiopiaData.regions.map(r => ({ value: r.name, label: r.name }))} onChange={handleRegionChange} placeholder="Select Region" />
                    <Select styles={selectStyles} options={zones.map(z => ({ value: z.name, label: z.name }))} onChange={handleZoneChange} placeholder="Select Zone" isDisabled={!formData.region} />
                    <Select styles={selectStyles} options={woredas.map(w => ({ value: w, label: w }))} onChange={(o) => setFormData(p => ({ ...p, woreda: o.value }))} placeholder="Select Woreda" isDisabled={!formData.zone} />
                    <input className="farmer-input" name="kebele" placeholder="Kebele Name" value={formData.kebele} onChange={handleChange} />
                  </div>
                  
                  <div className="dual-btns">
                    <button type="button" onClick={() => setCurrentStep(1)} className="back-btn"><MdChevronLeft /> Back</button>
                    <button type="button" onClick={nextStep} className="login-submit-btn">Next Step <MdChevronRight /></button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-content">
                  <div className="input-group">
                    <label className="input-label"><MdSecurity /> Security Password</label>
                    <input className="farmer-input" type="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange} required />
                    <input className="farmer-input" type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required style={{ marginTop: '10px' }} />
                  </div>

                  <div className="role-selector">
                    <p className="small-label">I am joining as a:</p>
                    <div className="role-grid">
                      {['farmer', 'buyer'].map(r => (
                        <label key={r} className={`role-card ${formData.role === r ? 'active' : ''}`}>
                          <input type="radio" checked={formData.role === r} onChange={() => setFormData(p => ({ ...p, role: r }))} />
                          {r === 'farmer' && <RiSeedlingLine />}
                          {r === 'buyer' && <RiUserSearchLine />}
    
                          <span>{r.toUpperCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="checkbox-section">
                    <label className="check-item"><input type="checkbox" name="terms_accepted" onChange={handleChange} /> Accept Terms & Conditions</label>
                    <label className="check-item"><input type="checkbox" name="privacy_accepted" onChange={handleChange} /> Accept Privacy Policy</label>
                    <label className="check-item"><input type="checkbox" name="platform_rules_accepted" onChange={handleChange} /> Accept Community Rules</label>
                  </div>

                  {/* Added Captcha Display */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={handleCaptchaChange}
                    />
                  </div>

                  <div className="dual-btns">
                    <button type="button" onClick={() => setCurrentStep(2)} className="back-btn"><MdChevronLeft /> Back</button>
                    <button type="submit" className="login-submit-btn" disabled={loading || !captchaToken}>
                      {loading ? <FiLoader className="spinner" /> : <><FiUserCheck /> Complete Registration</>}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="step-content">
            <div className="farmer-icon" style={{ color: '#2e7d32' }}><MdCheckCircle /></div>
            <h2 className="form-title">Registration Successful!</h2>
            <p className="form-subtitle">Welcome to our community.</p>
            <br /><br /><br />
            <button className="login-submit-btn success-state" style={{ background: '#1b4d3e', cursor: 'default' }}>
              <MdVerifiedUser /> succs wehave sent you verification code via email orsms
            </button>
            <br /><br /><br />
            <div className="loading-bar-minimal" style={{ marginTop: '30px' }}>
              <div className="loading-fill"></div>
            </div>
          </div>
        )}

        <div className="form-footer">
          Already a member? <Link to="/login">Sign In Here</Link>
        </div>
      </div>

      <style>{`
        .register-page-wrapper {
          background-color: #1b4d3e; min-height: 100vh; max-width: 100%;
          display: flex; justify-content: center; align-items: center;
          font-family: 'Segoe UI', sans-serif; 
          overflow-x: hidden;
          padding: 20px; box-sizing: border-box;
          margin: 0;
        }
        .level-up-card {
          background: #fff; padding: 40px; border-radius: 24px; width: 100%; max-width: 500px;
          box-shadow: 0 20px 60px rgba(0,0,0,.4); border-top: 8px solid #fb8c00; text-align: center; position: relative;
          box-sizing: border-box;
        }
        .step-progress-container { display: flex; justify-content: space-between; position: relative; margin-bottom: 30px; }
        .step-dot { 
          width: 35px; height: 35px; border-radius: 50%; background: #eee; z-index: 2; 
          display: flex; align-items: center; justify-content: center; font-weight: bold; color: #888; transition: 0.3s;
        }
        .step-dot.active { background: #fb8c00; color: #fff; transform: scale(1.1); }
        .progress-line { position: absolute; top: 17px; left: 0; height: 3px; background: #fb8c00; transition: 0.5s; z-index: 1; }
        
        .farmer-icon { font-size: 50px; color: #2e7d32; margin-bottom: 10px; }
        .form-title { color: #1b4d3e; font-size: 24px; font-weight: 800; margin: 0; }
        .form-subtitle { color: #666; font-size: 15px; margin-bottom: 25px; font-weight: 600; }
        
        .input-group { text-align: left; margin-bottom: 15px; }
        .input-label { font-weight: 700; color: #444; margin-bottom: 8px; font-size: 13px; display: flex; align-items: center; gap: 5px; }
        .farmer-input { width: 100%; padding: 14px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; transition: 0.3s; }
        .farmer-input:focus { border-color: #fb8c00; outline: none; }
        
        .alert-box.error { background: #ffebee; color: #c62828; padding: 12px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; border: 1px solid #ffcdd2; }
        
        .method-selector, .role-selector { text-align: left; margin-bottom: 20px; }
        .small-label { font-size: 12px; font-weight: 700; color: #777; margin-bottom: 10px; }
        
        .radio-group, .role-grid { display: flex; gap: 10px; }
        .radio-card, .role-card { 
          flex: 1; padding: 12px; border: 2px solid #eee; border-radius: 12px; cursor: pointer; 
          text-align: center; font-weight: 700; transition: 0.2s; font-size: 14px;
        }
        .role-card { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 12px; }
        .radio-card.selected, .role-card.active { border-color: #2e7d32; background: #f1f8e9; color: #2e7d32; }
        .radio-card input, .role-card input { display: none; }

        .checkbox-section { text-align: left; margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 12px; }
        .check-item { display: flex; align-items: center; gap: 10px; font-size: 13px; margin-bottom: 8px; cursor: pointer; color: #444; }
        
        .login-submit-btn { 
          width: 100%; padding: 16px; background: #fb8c00; color: #fff; border: none; border-radius: 12px; 
          cursor: pointer; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s; 
          box-sizing: border-box;
        }
        .login-submit-btn:hover:not(.success-state) { background: #ef6c00; transform: translateY(-2px); }
        .dual-btns { display: flex; gap: 10px; }
        .back-btn { padding: 16px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 12px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 5px; color: #666; }
        
        .form-footer { margin-top: 25px; font-size: 14px; color: #666; }
        .form-footer a { color: #fb8c00; font-weight: 700; text-decoration: none; }

        .loading-bar-minimal { height: 4px; width: 100%; background: #eee; border-radius: 10px; overflow: hidden; }
        .loading-fill { height: 100%; background: #fb8c00; animation: fill 5s linear forwards; }
        @keyframes fill { from { width: 0%; } to { width: 100%; } }
        
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .step-content { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default RegisterForm;
