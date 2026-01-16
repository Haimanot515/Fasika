import React, { useState } from "react";
import api from "../api/axios";
import { 
  FaHeadset, FaQuestionCircle, FaPaperPlane, 
  FaTools, FaHandHoldingUsd, FaSeedling, FaChevronDown 
} from "react-icons/fa";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    subject: "",
    issue_type: "Technical",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // POST to backend (Make sure your backend has this route registered)
      await api.post("/farmer/support/ticket", formData);
      setStatus({ type: "success", msg: "Ticket created! Our specialists will review it." });
      setFormData({ subject: "", issue_type: "Technical", description: "" });
    } catch (err) {
      setStatus({ type: "error", msg: "Connection lost. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const faqList = [
    { q: "How do I secure my payments?", a: "All transactions go through the DROP Registry escrow to ensure you get paid on time.", icon: <FaHandHoldingUsd color="#2ecc71"/> },
    { q: "What if my crop is rejected?", a: "You can open a dispute ticket here. We will mediate between you and the buyer.", icon: <FaQuestionCircle color="#3498db"/> },
    { q: "Weather data isn't updating.", a: "Ensure your location services are active for the Fasika app in your browser settings.", icon: <FaTools color="#e67e22"/> }
  ];

  return (
    <div style={styles.pageWrapper}>
      {/* PROFESSIONAL HERO SECTION */}
      <header style={styles.heroHeader}>
        <div style={styles.iconCircle}>
          <FaHeadset size={40} color="white" />
        </div>
        <h1 style={styles.mainTitle}>Fasika Farmer Support Center</h1>
        <p style={styles.subTitle}>Empowering your harvest with 24/7 technical and agricultural assistance.</p>
      </header>

      <div style={styles.mainGrid}>
        
        {/* LEFT COLUMN: FAQ ACCORDION */}
        <section style={styles.faqColumn}>
          <h2 style={styles.sectionHeader}><FaQuestionCircle /> Frequently Asked Questions</h2>
          {faqList.map((item, idx) => (
            <div key={idx} style={styles.faqCard}>
              <div style={styles.faqHeader}>
                <span style={styles.faqIcon}>{item.icon}</span>
                <span style={styles.faqQuestion}>{item.q}</span>
              </div>
              <p style={styles.faqAnswer}>{item.a}</p>
            </div>
          ))}
        </section>

        {/* RIGHT COLUMN: SUPPORT FORM */}
        <section style={styles.formColumn}>
          <div style={styles.formCard}>
            <h2 style={styles.sectionHeader}>Open a Support Ticket</h2>
            
            {status && (
              <div style={status.type === "success" ? styles.successAlert : styles.errorAlert}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Summarize the Issue</label>
                <input 
                  style={styles.input}
                  type="text"
                  placeholder="e.g., Unable to upload crop photo"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>

              <div style={styles.inputBox}>
                <label style={styles.label}>Select Category</label>
                <div style={styles.selectWrapper}>
                  <select 
                    style={styles.select}
                    value={formData.issue_type}
                    onChange={(e) => setFormData({...formData, issue_type: e.target.value})}
                  >
                    <option value="Technical">Technical (App Bug)</option>
                    <option value="Market">Marketplace & Prices</option>
                    <option value="Payment">Payments & Finance</option>
                    <option value="Advice">Agronomy Advice</option>
                  </select>
                </div>
              </div>

              <div style={styles.inputBox}>
                <label style={styles.label}>Describe your problem</label>
                <textarea 
                  style={styles.textarea}
                  rows="4"
                  placeholder="Please provide as much detail as possible..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? "Processing..." : <><FaPaperPlane /> Send Request</>}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- INLINE JAVASCRIPT CSS OBJECT ---
const styles = {
  pageWrapper: {
    padding: "60px 20px",
    background: "#fdfdfd",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  },
  heroHeader: {
    textAlign: "center",
    marginBottom: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  iconCircle: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
    boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)"
  },
  mainTitle: { fontSize: "2.5rem", fontWeight: "800", color: "#1e293b", margin: 0 },
  subTitle: { fontSize: "1.1rem", color: "#64748b", maxWidth: "600px", marginTop: "10px" },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  sectionHeader: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  // FAQ STYLES
  faqColumn: { display: "flex", flexDirection: "column", gap: "15px" },
  faqCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #e2e8f0",
    transition: "transform 0.2s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
  },
  faqHeader: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" },
  faqQuestion: { fontWeight: "600", color: "#1e293b", fontSize: "1rem" },
  faqAnswer: { color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 },

  // FORM STYLES
  formCard: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
    border: "1px solid #f1f5f9"
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputBox: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.9rem", fontWeight: "600", color: "#475569" },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s"
  },
  select: {
    padding: "14px",
    width: "100%",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    appearance: "none",
    backgroundColor: "#fff",
    fontSize: "1rem"
  },
  textarea: {
    padding: "14px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    resize: "none"
  },
  btn: {
    background: "#0f172a",
    color: "#fff",
    padding: "16px",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
    transition: "background 0.2s"
  },
  successAlert: { padding: "15px", background: "#dcfce7", color: "#166534", borderRadius: "8px", fontWeight: "600" },
  errorAlert: { padding: "15px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontWeight: "600" }
};

export default SupportPage;
