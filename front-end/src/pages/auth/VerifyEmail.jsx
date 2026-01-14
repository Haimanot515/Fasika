import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
// --- PURE REACT ICONS ---
import { PiPlantDuotone, PiCircleNotchBold, PiShieldCheckDuotone, PiShieldWarningDuotone, PiArrowRightBold } from "react-icons/pi";
import { TbTornado } from "react-icons/tb";

const VerifyEmail = ({ onVerify }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); 
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Cryptographic handshake failed. Token missing.");
        return;
      }
      try {
        // We include withCredentials to ensure the verification response 
        // can set the auth_token cookie in the browser.
        const res = await api.post("/auth/verify-user", { token }, { withCredentials: true });
        
        /* Backend Response matches: 
           { authenticated: true, role: 'FARMER', user_id: 'USR-101' } 
        */
        if (res.data.authenticated) {
          const roles = Array.isArray(res.data.role) ? res.data.role : [res.data.role];
          
          // Store UI metadata only (No sensitive tokens here)
          localStorage.setItem("role", JSON.stringify(roles));
          localStorage.setItem("user_id", res.data.user_id); 
          localStorage.setItem("isAuthenticated", "true");

          if (onVerify) onVerify(roles);
          
          setStatus("success");
          // Redirect to dashboard after showing the success state
          setTimeout(() => navigate("/dashboard"), 3000);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setErrorMessage(err.response?.data?.error || "Signature expired or network failure.");
      }
    };
    verify();
  }, [token, navigate, onVerify]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a", 
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: "20px"
    }}>
      <style>
        {`
          @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes pulse-soft { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.95); } }
          
          .spin-fast { animation: spin-cw 1s linear infinite; }
          .spin-medium { animation: spin-ccw 2s linear infinite; }
          .spin-slow { animation: spin-cw 4s linear infinite; }
          .pulse { animation: pulse-soft 3s ease-in-out infinite; }
          
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 48px;
            padding: 60px 40px;
            width: 100%;
            max-width: 450px;
            text-align: center;
            box-shadow: 0 40px 100px rgba(0,0,0,0.4);
          }

          .icon-layers {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .layer { position: absolute; display: flex; align-items: center; justify-content: center; }
        `}
      </style>

      <div className="glass-card">
        <div className="pulse" style={{ marginBottom: "50px" }}>
          <PiPlantDuotone size={40} color="#2ecc71" />
          <h2 style={{ color: "#fff", fontSize: "14px", letterSpacing: "4px", marginTop: "15px", fontWeight: "300" }}>
            FASIKA CORE
          </h2>
        </div>

        {status === "loading" && (
          <div>
            <div className="icon-layers">
              <div className="layer spin-fast" style={{ color: "rgba(46, 204, 113, 0.2)" }}>
                <PiCircleNotchBold size={120} />
              </div>
              <div className="layer spin-medium" style={{ color: "rgba(46, 204, 113, 0.4)" }}>
                <PiCircleNotchBold size={85} />
              </div>
              <div className="layer spin-slow" style={{ color: "#2ecc71" }}>
                <TbTornado size={45} />
              </div>
            </div>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "15px" }}>Synchronizing</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
              Verifying node credentials against the encrypted gateway.
            </p>
          </div>
        )}

        {status === "success" && (
          <div style={{ animation: "pulse-soft 2s ease-in-out" }}>
            <div className="icon-layers">
              <div className="layer" style={{ color: "#2ecc71" }}>
                <PiShieldCheckDuotone size={100} />
              </div>
            </div>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "15px" }}>Access Granted</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
              Identity confirmed. Redirecting to your secure dashboard.
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="icon-layers">
              <div className="layer" style={{ color: "#e74c3c" }}>
                <PiShieldWarningDuotone size={100} />
              </div>
            </div>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "15px" }}>Verification Error</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.6", marginBottom: "40px" }}>
              {errorMessage}
            </p>
            <button 
              onClick={() => navigate("/login")}
              style={{
                background: "#fff",
                color: "#000",
                border: "none",
                padding: "18px 35px",
                borderRadius: "20px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                transition: "0.3s"
              }}
            >
              Return to Gateway <PiArrowRightBold size={18} />
            </button>
          </div>
        )}

        <div style={{ marginTop: "60px", color: "rgba(255,255,255,0.2)", fontSize: "10px", fontWeight: "700", letterSpacing: "1px" }}>
          PROTOCOL: VERIFY-CHAIN-V1
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
