import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  HiOutlineSearch, HiOutlineExclamation, HiOutlinePencilAlt, 
  HiOutlineTrash, HiOutlineMap, HiOutlineBeaker, HiOutlineShoppingCart 
} from 'react-icons/hi';
import { GiCow } from 'react-icons/gi';

const AdminFarmersSidebar = ({ isOpen = true }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null); // Ref to detect clicks outside
  const [collapsed, setCollapsed] = useState(!isOpen);
  
  // Set all to false by default for accordion behavior
  const [openL1, setOpenL1] = useState({ FARMS: false, SOIL: false, LIVESTOCK: false, MARKET: false });
  
  const [verificationMode, setVerificationMode] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:5000/api/admin/farmers';
  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // --- ACCORDION & CLICK OUTSIDE LOGIC ---

  // 1. Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
        // Also close all sub-menus when clicking away
        setOpenL1({ FARMS: false, SOIL: false, LIVESTOCK: false, MARKET: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Accordion Toggle: Close others when one opens
  const toggleL1 = (key) => {
    if (collapsed) setCollapsed(false);
    setOpenL1(prev => ({
      FARMS: false, SOIL: false, LIVESTOCK: false, MARKET: false, // Reset all
      [key]: !prev[key] // Toggle clicked one
    }));
  };

  const startAction = (e, mode) => {
    e.preventDefault();
    setVerificationMode(mode);
    setSearchQuery("");
    setConfirmStep(false);
  };

  const closeOverlay = () => {
    setVerificationMode(null);
    setConfirmStep(false);
    setTargetId(null);
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const module = verificationMode.split('_')[1].toLowerCase(); 
      const response = await axios.get(`${API_BASE}/${module}/verify/${searchQuery}`, getHeaders());
      if (response.data.success) {
        setTargetId(searchQuery);
        setConfirmStep(true);
      }
    } catch (error) {
      alert(`VERIFICATION FAILED: ID ${searchQuery} not found in the registry.`);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = async () => {
    setLoading(true);
    try {
      const module = verificationMode.split('_')[1].toLowerCase();
      if (verificationMode.includes('UPDATE')) {
        closeOverlay();
        navigate(`/admin/farmers/${module}/update/${targetId}`);
      } else {
        // USING 'DROP' IN THE SCHEMA/ENDPOINT
        const response = await axios.delete(`${API_BASE}/${module}/drop/${targetId}`, getHeaders());
        if (response.data.success) {
          alert(`SUCCESS: Record ${targetId} has been DROPPED.`);
          closeOverlay();
          window.location.reload(); 
        }
      }
    } catch (error) {
      alert("CRITICAL ERROR: System operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const sidebarStyle = {
    width: collapsed ? "70px" : "320px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    position: "fixed", top: "78px", height: "calc(100vh - 78px)", left: 0,
    zIndex: 100, overflowY: "auto", paddingBottom: "80px", boxShadow: "4px 0 10px rgba(0,0,0,0.05)"
  };

  const l3LinkStyle = ({ isActive, isDelete, isUpdate } = {}) => ({
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 20px 10px 50px",
    textDecoration: "none",
    fontSize: "13px",
    color: isDelete ? "#ef4444" : (isUpdate ? "#3182ce" : (isActive ? "#059669" : "#64748b")),
    background: isActive ? "#ecfdf5" : "transparent",
    fontWeight: isActive || isUpdate || isDelete ? "700" : "500",
  });

  return (
    <>
      <style>
        {`
          .admin-sidebar-scroll::-webkit-scrollbar { width: 4px; }
          .admin-sidebar-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .overlay-bg { position: fixed; top:0; left:0; width:100vw; height:100vh; background: rgba(15,23,42,0.85); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(4px); }
          .modal-box { background: white; padding: 35px; border-radius: 16px; width: 420px; text-align: center; }
        `}
      </style>

      {/* --- VERIFICATION MODAL (Logic remains same) --- */}
      {verificationMode && (
        <div className="overlay-bg">
            {/* Modal Content omitted for brevity, same as your original snippet */}
            <div className="modal-box">
                <h3 style={{marginBottom: '20px'}}>{verificationMode.replace('_', ' ')}</h3>
                <input 
                    placeholder="Enter ID" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    style={{width: '100%', padding: '10px', marginBottom: '20px'}}
                />
                <button onClick={handleVerify}>Verify</button>
                <button onClick={closeOverlay}>Cancel</button>
                {confirmStep && <button onClick={handleExecuteAction} style={{background: 'red', color: 'white'}}>CONFIRM DROP</button>}
            </div>
        </div>
      )}

      <aside ref={sidebarRef} style={sidebarStyle} className="admin-sidebar-scroll">
        <div style={{ padding: "20px" }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", color: "#065f46", background: "#f8fafc", cursor: "pointer", fontWeight: "800", borderRadius: "8px", fontSize: "11px" }}>
            {collapsed ? "☰" : "EXIT CONTROL PANEL"}
          </button>
        </div>

        <nav>
          <SectionItem icon={<HiOutlineMap/>} label="LAND REGISTRY" isOpen={openL1.FARMS} collapsed={collapsed} toggle={() => toggleL1('FARMS')}>
                <NavLink style={l3LinkStyle} to="/admin/farmers/land/view">View Records</NavLink>
                <NavLink style={l3LinkStyle} to="/admin/farmers/land/post">Register New Plot</NavLink>
                <a href="#" onClick={(e) => startAction(e, 'UPDATE_LAND')} style={l3LinkStyle({isUpdate: true})}>Update Plot Info</a>
                <a href="#" onClick={(e) => startAction(e, 'DROP_LAND')} style={l3LinkStyle({isDelete: true})}>Drop Land Plot</a>
          </SectionItem>

          <SectionItem icon={<HiOutlineBeaker/>} label="SOIL ANALYTICS" isOpen={openL1.SOIL} collapsed={collapsed} toggle={() => toggleL1('SOIL')}>
                <NavLink style={l3LinkStyle} to="/admin/farmers/soil/view">View Reports</NavLink>
                <NavLink style={l3LinkStyle} to="/admin/farmers/soil/post">Submit Report</NavLink>
                <a href="#" onClick={(e) => startAction(e, 'UPDATE_SOIL')} style={l3LinkStyle({isUpdate: true})}>Modify Report</a>
                <a href="#" onClick={(e) => startAction(e, 'DROP_SOIL')} style={l3LinkStyle({isDelete: true})}>Drop Report</a>
          </SectionItem>

          <SectionItem icon={<GiCow/>} label="LIVESTOCK UNIT" isOpen={openL1.LIVESTOCK} collapsed={collapsed} toggle={() => toggleL1('LIVESTOCK')}>
                <NavLink style={l3LinkStyle} to="/admin/farmers/livestock/view">View Registry</NavLink>
                <NavLink style={l3LinkStyle} to="/admin/farmers/livestock/post">Log New Head</NavLink>
                <a href="#" onClick={(e) => startAction(e, 'UPDATE_LIVESTOCK')} style={l3LinkStyle({isUpdate: true})}>Update Record</a>
                <a href="#" onClick={(e) => startAction(e, 'DROP_LIVESTOCK')} style={l3LinkStyle({isDelete: true})}>Drop Record</a>
          </SectionItem>
        </nav>
      </aside>
    </>
  );
};

const SectionItem = ({ icon, label, isOpen, collapsed, toggle, children }) => (
    <div style={{borderBottom: '1px solid #f1f5f9'}}>
        <button style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 20px", cursor: "pointer", background: "#fff", border: 'none', width: "100%",
            color: "#065f46", fontWeight: "800", fontSize: "11px"
        }} onClick={toggle}>
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span style={{fontSize: '18px'}}>{icon}</span>
                {!collapsed && label}
            </span>
            {!collapsed && <span style={{color: '#cbd5e1'}}>{isOpen ? "−" : "+"}</span>}
        </button>
        {isOpen && !collapsed && <div>{children}</div>}
    </div>
);

export default AdminFarmersSidebar;