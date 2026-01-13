import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // use your axios setup

const VerifyOTP = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!phone || !otp) {
      setStatus("❌ Phone number and OTP are required.");
      return;
    }

    setLoading(true);
    setStatus("⏳ Verifying OTP...");

    try {
      const res = await api.post("/auth/verify-user", { phone, otp, channel: "SMS" });

      setStatus("✅ OTP verified successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.error || "❌ Invalid or expired OTP.";
      const attempts = err.response?.data?.attempts_remaining;
      setStatus(attempts ? `${message} Attempts left: ${attempts}` : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "80px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#27ae60", marginBottom: "20px" }}>
        OTP Verification
      </h2>

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#27ae60",
          color: "#fff",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "#555" }}>{status}</p>
    </div>
  );
};

export default VerifyOTP;
