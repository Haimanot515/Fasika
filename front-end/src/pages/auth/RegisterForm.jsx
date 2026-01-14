import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import api from "../../api/axios"; // ✅ Use your configured axios instance

// Farmer-friendly icons
import { 
  MdOutlinePersonOutline, MdPhoneIphone, MdOutlineMail, MdLocationOn, MdSecurity,
  MdCheckCircle, MdChevronRight, MdChevronLeft, MdErrorOutline, MdOutlineAssignmentTurnedIn,
  MdVerifiedUser
} from "react-icons/md";
import { FiLoader, FiUserCheck } from "react-icons/fi";
import { RiSeedlingLine, RiUserSearchLine } from "react-icons/ri";

import ethiopiaData from "../../data/ethiopia.json";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", phone: "", email: "", password: "", confirmPassword: "",
    role: "farmer", region: "", zone: "", woreda: "", kebele: "",
    preferred_method: "SMS", terms_accepted: false, privacy_accepted: false,
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

    // Password check
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    // Agreement check
    if (!formData.terms_accepted || !formData.privacy_accepted || !formData.platform_rules_accepted) {
      return setError("Please accept all agreements to create your account.");
    }

    setLoading(true);
    setError("");

    try {
      const payload = { ...formData, role: formData.role.toLowerCase() };

      // ✅ Use centralized axios instance with env variable
      await api.post("/auth/register-user", payload);

      setIsRegistered(true);

      // 5-second redirect delay
      setTimeout(() => {
        if (formData.preferred_method === "EMAIL") navigate("/login");
        else navigate("/verify-otp", { state: { phone: formData.phone } });
      }, 5000);

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
      setLoading(false);
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
            {/* Step Progress */}
            <div className="step-progress-container">
              {[1,2,3].map(step => (
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
              {/* Step 1 */}
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
                      {["SMS","EMAIL"].map(m => (
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

              {/* Step 2 */}
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

              {/* Step 3 */}
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
                      {['farmer','buyer','both'].map(r => (
                        <label key={r} className={`role-card ${formData.role === r ? 'active' : ''}`}>
                          <input type="radio" checked={formData.role === r} onChange={() => setFormData(p => ({ ...p, role: r }))} />
                          {r === 'farmer' && <RiSeedlingLine />}
                          {r === 'buyer' && <RiUserSearchLine />}
                          {r === 'both' && <MdOutlineAssignmentTurnedIn />}
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

                  <div className="dual-btns">
                    <button type="button" onClick={() => setCurrentStep(2)} className="back-btn"><MdChevronLeft /> Back</button>
                    <button type="submit" className="login-submit-btn" disabled={loading}>
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
            
            <button className="login-submit-btn success-state" style={{ background: '#1b4d3e', cursor: 'default' }}>
              <MdVerifiedUser /> Success! Verification code sent via SMS or Email
            </button>
            
            <div className="loading-bar-minimal" style={{ marginTop: '30px' }}>
              <div className="loading-fill"></div>
            </div>
          </div>
        )}

        <div className="form-footer">
          Already a member? <Link to="/login">Sign In Here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
