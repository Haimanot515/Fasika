import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

// Extreme Level Icons
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
import { FiLoader, FiUserCheck, FiShield, FiArrowLeft } from "react-icons/fi";
import { RiSeedlingLine } from "react-icons/ri";

import ethiopiaData from "../../data/ethiopia.json";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // Success Acclamation State

  const [formData, setFormData] = useState({
    full_name: "", phone: "", email: "", password: "", confirmPassword: "",
    role: "farmer", region: "", zone: "", woreda: "", kebele: "",
    preferred_method: "SMS", terms_accepted: false, privacy_accepted: false,
    platform_rules_accepted: false, communication_consent: true,
  });

  const [zones, setZones] = useState([]);
  const [woredas, setWoredas] = useState([]);

  const validateStep = () => {
    setError("");
    if (currentStep === 1) {
      if (!formData.full_name || !formData.phone) return setError("Name and phone are required");
      const phoneRegex = /^(?:0|251|\+251)?9\d{8}$/;
      if (!phoneRegex.test(formData.phone)) return setError("Invalid Ethiopian phone number");
    }
    if (currentStep === 2) {
      if (!formData.region || !formData.zone || !formData.woreda || !formData.kebele) 
        return setError("Please complete all location fields");
    }
    return true;
  };

  const nextStep = () => validateStep() && setCurrentStep((s) => s + 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
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
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    if (!formData.terms_accepted || !formData.privacy_accepted) return setError("Please accept agreements");

    setLoading(true);
    try {
      const payload = { ...formData, role: formData.role.toLowerCase() };
      await axios.post("http://localhost:5000/api/auth/register-user", payload);
      
      // TRIGGER ACCLAMATION
      setIsRegistered(true);
      
      // Delay navigation to show off the success state
      setTimeout(() => {
        if (formData.preferred_method === "EMAIL") navigate("/login");
        else navigate("/verify-otp", { state: { phone: formData.phone } });
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base, borderRadius: '12px', border: '2px solid #eee', marginBottom: '15px', padding: '4px'
    })
  };

  return (
    <div className="login-full-width-wrapper">
      <div className="level-up-card" style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
        
        {!isRegistered ? (
          <>
            <div className="step-bar-container">
              <div className="step-bar-fill" style={{ width: `${(currentStep / 3) * 100}%` }} />
            </div>

            <div className="farmer-icon" style={{ marginTop: '20px', color: '#2e7d32' }}>
              <RiSeedlingLine style={{ fontSize: '50px' }} />
            </div>

            <h2 className="form-title">Step {currentStep} Registration</h2>
            <p className="form-subtitle">Join the professional farming network.</p>

            {error && <div className="alert error-alert"><MdErrorOutline /> {error}</div>}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="step-fade">
                  <div className="input-group">
                    <label className="input-label"><MdOutlinePersonOutline /> Full Name</label>
                    <input className="farmer-input" name="full_name" placeholder="Enter name" value={formData.full_name} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginTop: '15px' }}>
                    <label className="input-label"><MdPhoneIphone /> Phone</label>
                    <input className="farmer-input" name="phone" placeholder="09..." value={formData.phone} onChange={handleChange} />
                  </div>
                  <button type="button" onClick={nextStep} className="login-submit-btn">Continue <MdChevronRight /></button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-fade">
                  <div className="input-group">
                    <label className="input-label"><MdLocationOn /> Location Details</label>
                    <Select styles={selectStyles} options={ethiopiaData.regions.map(r => ({ value: r.name, label: r.name }))} onChange={handleRegionChange} placeholder="Region" />
                    <Select styles={selectStyles} options={zones.map(z => ({ value: z.name, label: z.name }))} onChange={handleZoneChange} placeholder="Zone" isDisabled={!formData.region} />
                    <Select styles={selectStyles} options={woredas.map(w => ({ value: w, label: w }))} onChange={(o) => setFormData(p => ({ ...p, woreda: o.value }))} placeholder="Woreda" isDisabled={!formData.zone} />
                  </div>
                  <div className="dual-btns">
                    <button type="button" onClick={() => setCurrentStep(1)} className="back-btn"><MdChevronLeft /> Back</button>
                    <button type="button" onClick={nextStep} className="login-submit-btn" style={{ marginTop: 0 }}>Next <MdChevronRight /></button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-fade">
                  <div className="input-group">
                    <label className="input-label"><MdSecurity /> Password</label>
                    <input className="farmer-input" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                  </div>
                  <div className="role-grid">
                    {['farmer', 'buyer', 'both'].map(r => (
                      <label key={r} className={`role-card ${formData.role === r ? 'active' : ''}`}>
                        <input type="radio" checked={formData.role === r} onChange={() => setFormData(p => ({ ...p, role: r }))} style={{ display: 'none' }} />
                        {r.toUpperCase()}
                      </label>
                    ))}
                  </div>
                  <div className="check-list">
                    <label className="check-item"><input type="checkbox" name="terms_accepted" onChange={handleChange} /> I agree to Terms</label>
                  </div>
                  <div className="dual-btns">
                    <button type="button" onClick={() => setCurrentStep(2)} className="back-btn"><MdChevronLeft /> Back</button>
                    <button type="submit" className="login-submit-btn" style={{ marginTop: 0 }} disabled={loading}>
                      {loading ? <FiLoader className="spinner" /> : "Complete Registration"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          /* ACCLAMATION SUCCESS STATE */
          <div className="success-acclamation">
            <div className="celebration-ring">
              <MdVerifiedUser className="verified-icon" />
            </div>
            <h2 className="form-title">Welcome Aboard!</h2>
            <p className="form-subtitle">Your profile has been created successfully.</p>
            <div className="loading-bar-minimal">
              <div className="loading-fill"></div>
            </div>
            <p className="redirect-text">Redirecting to verification...</p>
          </div>
        )}

        <div className="footer-container">
          <Link to="/login" className="back-to-login"><FiArrowLeft /> Back to Login</Link>
        </div>
      </div>
      <style>{styles}</style>
    </div>
  );
};

const styles = `
  .login-full-width-wrapper {
    background-color: #1b4d3e; min-height: 100vh; width: 100%;
    display: flex; justify-content: center; align-items: center;
    font-family: 'Segoe UI', sans-serif; overflow-x: hidden; padding: 20px; box-sizing: border-box;
  }
  .level-up-card {
    background: #fff; padding: 40px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.4);
    border-top: 8px solid #fb8c00; text-align: center;
  }
  .step-bar-container { height: 6px; width: 100%; background: #eee; position: absolute; top: 0; left: 0; }
  .step-bar-fill { height: 100%; background: #fb8c00; transition: width 0.4s ease; }
  .form-title { color: #1b4d3e; font-size: 26px; font-weight: 800; margin-bottom: 5px; }
  .form-subtitle { color: #666; font-size: 14px; margin-bottom: 25px; }
  .input-group { text-align: left; }
  .input-label { display: block; font-weight: 700; color: #444; margin-bottom: 8px; font-size: 14px; }
  .farmer-input { 
    width: 100%; padding: 15px; border: 2px solid #eee; border-radius: 12px; 
    box-sizing: border-box; font-size: 16px; transition: border-color 0.3s;
  }
  .farmer-input:focus { border-color: #fb8c00; outline: none; }
  .alert { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 8px; margin-top: 20px; font-weight: 600; }
  .error-alert { color: #c62828; background: #ffebee; }
  
  .login-submit-btn {
    width: 100%; padding: 16px; background: #2e7d32; color: #fff; border: none; 
    border-radius: 12px; cursor: pointer; font-size: 18px; font-weight: 700;
    margin-top: 25px; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s;
  }
  .login-submit-btn:hover { background: #1b4d3e; transform: translateY(-2px); }
  .dual-btns { display: flex; gap: 10px; margin-top: 25px; }
  .back-btn { padding: 16px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 12px; cursor: pointer; color: #666; font-weight: 600; }
  
  .role-grid { display: flex; gap: 8px; margin-top: 20px; }
  .role-card { flex: 1; padding: 12px; border: 2px solid #eee; border-radius: 10px; cursor: pointer; font-size: 12px; font-weight: 800; color: #999; }
  .role-card.active { border-color: #2e7d32; background: #e8f5e9; color: #2e7d32; }
  
  /* Acclamation Styling */
  .success-acclamation { padding: 20px 0; animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .celebration-ring { 
    width: 80px; height: 80px; background: #e8f5e9; border-radius: 50%; 
    display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
    border: 4px solid #2e7d32; color: #2e7d32;
  }
  .verified-icon { font-size: 45px; animation: pop 0.6s delay 0.2s both; }
  .loading-bar-minimal { height: 4px; width: 150px; background: #eee; margin: 20px auto; border-radius: 10px; overflow: hidden; }
  .loading-fill { height: 100%; background: #fb8c00; animation: fill 3s linear forwards; }
  .redirect-text { font-size: 12px; color: #888; font-weight: 600; }

  @keyframes fill { from { width: 0%; } to { width: 100%; } }
  @keyframes pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
  @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .spinner { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .step-fade { animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default RegisterForm;