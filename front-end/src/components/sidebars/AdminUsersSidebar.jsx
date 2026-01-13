import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineSearch, HiOutlineExclamation } from 'react-icons/hi';
import axios from 'axios';

const AdminUsersSidebar = ({ isOpen = true }) => {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const [openL1, setOpenL1] = useState({ ACCOUNTS: true });
  
  // Verification & Execution States
  const [verificationMode, setVerificationMode] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);
  const [targetUser, setTargetUser] = useState(null); // Will store full user object from DB
  const [loading, setLoading] = useState(false);

  // API Config
  const api = axios.create({
    baseURL: 'http://localhost:5000/api/admin/users',
    withCredentials: true
  });

  const toggleSidebar = () => setCollapsed(prev => !prev);
  const toggleL1 = (key) => {
    if (collapsed) setCollapsed(false);
    setOpenL1(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const startVerification = (e, type) => {
    e.preventDefault();
    setVerificationMode(type);
    setSearchQuery("");
    setTargetUser(null);
    setConfirmStep(false);
  };

  const closeOverlay = () => {
    setVerificationMode(null);
    setTargetUser(null);
    setLoading(false);
  };

  // --- NEW: BACKEND INTEGRATION LOGIC ---

  // Step 1: Find user to verify they exist before dropping/terminating
  const handleLocateIdentity = async () => {
    setLoading(true);
    try {
      // We search by ID or Email (backend handles params)
      const res = await api.get(`/${searchQuery}`);
      if (res.data.success) {
        setTargetUser(res.data.user);
        setConfirmStep(true);
      }
    } catch (err) {
      alert("Identity not found in registry. Please check ID/Email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Final Command Execution
  const handleExecuteCommand = async () => {
    setLoading(true);
    try {
      if (verificationMode === 'DROP') {
        // PERMANENT REMOVAL
        await api.delete(`/${targetUser.id}`);
        alert(`SUCCESS: Identity ${targetUser.user_id} has been DROPPED.`);
      } else {
        // SESSION TERMINATION
        await api.delete(`/${targetUser.id}/sessions`);
        alert(`SUCCESS: All active sessions for ${targetUser.full_name} terminated.`);
      }
      closeOverlay();
      window.location.reload(); // Refresh to update main table
    } catch (err) {
      alert(`CRITICAL ERROR during ${verificationMode} sequence.`);
    } finally {
      setLoading(false);
    }
  };

  const sidebarStyle = {
    width: collapsed ? "70px" : "350px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    position: "fixed",
    top: "78px",
    height: "calc(100vh - 78px)",
    left: 0,
    zIndex: 100,
    overflowY: "auto",
  };

  return (
    <>
      {/* --- STEP 1: SEARCH USER OVERLAY --- */}
      {verificationMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', width: '500px', borderRadius: '16px', 
            padding: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            {!confirmStep ? (
              <>
                <h2 style={{margin: '0 0 10px 0', color: '#1e293b'}}>Verify Identity</h2>
                <p style={{color: '#64748b', fontSize: '14px', marginBottom: '20px'}}>
                  Enter the Internal ID to initiate the <strong>{verificationMode}</strong> sequence.
                </p>
                
                <div style={{position: 'relative', marginBottom: '20px'}}>
                  <HiOutlineSearch style={{position: 'absolute', left: '12px', top: '14px', color: '#94a3b8'}}/>
                  <input 
                    autoFocus
                    placeholder="Ex: 105 or admin@system.com"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocateIdentity()}
                    style={{
                      width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                      border: '2px solid #e2e8f0', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{display: 'flex', gap: '10px'}}>
                  <button onClick={closeOverlay} style={{flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '600'}}>Cancel</button>
                  <button 
                    disabled={!searchQuery || loading}
                    onClick={handleLocateIdentity}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '8px', border: 'none', 
                      background: '#4f46e5', color: 'white', fontWeight: '600', cursor: searchQuery ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {loading ? "Searching..." : "Locate Identity"}
                  </button>
                </div>
              </>
            ) : (
              /* --- STEP 2: FINAL CONFIRMATION --- */
              <div style={{textAlign: 'center'}}>
                <div style={{
                  width: '60px', height: '60px', background: verificationMode === 'DROP' ? '#fee2e2' : '#fef3c7', 
                  color: verificationMode === 'DROP' ? '#ef4444' : '#f59e0b',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px auto'
                }}>
                  <HiOutlineExclamation size={32}/>
                </div>
                <h2 style={{margin: '0 0 10px 0', color: '#991b1b'}}>Confirm {verificationMode}</h2>
                <p style={{color: '#475569', fontSize: '14px'}}>
                  Are you sure you want to execute <strong>{verificationMode}</strong> for:
                  <br/><strong style={{fontSize: '20px', color: '#1e293b'}}>{targetUser.full_name}</strong>
                  <br/><span style={{fontSize: '12px'}}>Role: {targetUser.role} | ID: {targetUser.user_id}</span>
                </p>
                
                <div style={{marginTop: '30px', display: 'flex', gap: '10px'}}>
                  <button onClick={() => setConfirmStep(false)} style={{flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer'}}>Back</button>
                  <button 
                    disabled={loading}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '8px', border: 'none', 
                      background: verificationMode === 'DROP' ? '#ef4444' : '#f59e0b', 
                      color: 'white', fontWeight: 'bold', cursor: 'pointer'
                    }}
                    onClick={handleExecuteCommand}
                  >
                    {loading ? "Processing..." : `EXECUTE ${verificationMode}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SIDEBAR CONTENT --- */}
      <aside style={sidebarStyle}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <button onClick={toggleSidebar} style={{ width: "100%", padding: "12px", border: "2px solid #27ae60", color: "#27ae60", background: "white", cursor: "pointer", fontWeight: "900", borderRadius: "4px" }}>
            {collapsed ? "👥" : "CLOSE USER CONSOLE"}
          </button>
        </div>

        {!collapsed && (
          <nav>
            {/* ACCOUNTS SECTION */}
            <div style={{borderBottom: '1px solid #f1f5f9'}}>
              <button onClick={() => toggleL1('ACCOUNTS')} style={{width: '100%', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', border: 'none', background: 'none', cursor: 'pointer', color: '#27ae60', fontWeight: 'bold'}}>
                <span>USER ACCOUNTS</span>
                <span>{openL1.ACCOUNTS ? '−' : '+'}</span>
              </button>
              
              {openL1.ACCOUNTS && (
                <div style={{paddingBottom: '10px'}}>
                  <NavLink to="/admin/users/list" style={{display: 'block', padding: '10px 40px', textDecoration: 'none', color: '#64748b', fontSize: '13px'}}>Get All Users</NavLink>
                  <a href="#" onClick={(e) => startVerification(e, 'DROP')} style={{display: 'block', padding: '10px 40px', textDecoration: 'none', color: '#ef4444', fontSize: '13px', fontWeight: 'bold'}}>Drop User Account</a>
                </div>
              )}
            </div>

            {/* SESSIONS SECTION */}
            <div>
              <button onClick={() => toggleL1('SESSIONS')} style={{width: '100%', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', border: 'none', background: 'none', cursor: 'pointer', color: '#27ae60', fontWeight: 'bold'}}>
                <span>SECURITY & SESSIONS</span>
                <span>{openL1.SESSIONS ? '−' : '+'}</span>
              </button>
              
              {openL1.SESSIONS && (
                <div style={{paddingBottom: '10px'}}>
                  <NavLink to="/admin/users/sessions" style={{display: 'block', padding: '10px 40px', textDecoration: 'none', color: '#64748b', fontSize: '13px'}}>View History</NavLink>
                  <a href="#" onClick={(e) => startVerification(e, 'TERMINATE')} style={{display: 'block', padding: '10px 40px', textDecoration: 'none', color: '#f59e0b', fontSize: '13px', fontWeight: 'bold'}}>Terminate Sessions</a>
                </div>
              )}
            </div>
          </nav>
        )}
      </aside>
    </>
  );
};

export default AdminUsersSidebar;