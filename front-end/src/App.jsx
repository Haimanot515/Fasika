import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/common/Footer";

// --- AUTH & PUBLIC PAGES ---
import Landing from "./pages/auth/Landing";
import LoginForm from "./pages/auth/LoginForm";
import RegisterForm from "./pages/auth/RegisterForm";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SupportPage from "./pages/Help";
import NotificationsPage from "./pages/Notifications";

// --- ADMIN PAGES ---
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminFarmerStatsDashboard from './pages/admin/AdminFarmerStatsDashboard';
import AdminMarketDashboard from './pages/admin/AdminMarketDashboard';
import AdminPostLand from './pages/admin/AdminPostLand';
import AdminViewLand from "./pages/admin/AdminViewLand";
import AdminUpdateLand from './pages/admin/AdminUpdateLand';
import AdminUpdateLivestock from './pages/admin/AdminUpdateLivstoke'; 

// --- FARM MANAGEMENT & REGISTRY ---
import FarmerRegistrationForm from "./pages/FarmerProfile";   
import FarmerUpdateProfile from "./pages/FarmerUpdateProfile"; 
import ViewLand from "./pages/MyFarm/ViewLand";
import AddLand from "./pages/MyFarm/AddLand";
import UpdateLand from "./pages/MyFarm/UpdateLand"; 

// --- MARKETPLACE SECTION ---
import AddFarmerListing from "./pages/market/AddFarmerListing";
import ViewFarmerListing from "./pages/market/ViewFarmerListing";
import EditFarmerListing from "./pages/market/EditFarmerListing"; 
import BuyerMarketplace from "./pages/market/BuyerMarketplace";
import AdvisoryBoard from "./pages/Advisory";

// --- ECOSYSTEM & DASHBOARD ---
import DynamicDashboard from "./pages/dashboard/DynamicDashboard";
import WeatherPage from "./pages/WeatherPage";
import ProtectedLayout from "./layouts/ProtectedLayout";

const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "24px", color: "#166534", fontWeight: "bold" }}>
    🌾 Loading Farm Systems...
  </div>
);

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("role");
    if (stored) {
      try {
        setRole(JSON.parse(stored));
      } catch (e) {
        setRole(stored);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <Spinner />;

  return (
    <Router>
      <Routes>
        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm onLogin={setRole} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify-email" element={<VerifyEmail onVerify={setRole} />} />
        <Route path="/verify-OTP" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/marketplace" element={<BuyerMarketplace />} />

        {/* 🔐 PROTECTED ROUTES (Structured to prevent Footer overlapping) */}
        <Route element={
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
              <ProtectedLayout role={role} />
            </div>
            <Footer />
          </div>
        }>
          <Route path="/dashboard/*" element={<DynamicDashboard role={role} />} />
          <Route path="/my-farm/land/view" element={<ViewLand />} />
          <Route path="/my-farm/land/add" element={<AddLand />} />
          <Route path="/my-farm/land/update/:id" element={<UpdateLand />} />
          <Route path="/advisory" element={<AdvisoryBoard />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile/create-account" element={<FarmerRegistrationForm />} />
          <Route path="/profile/update-account" element={<FarmerUpdateProfile />} />
          <Route path="/market/sales" element={<ViewFarmerListing />} />
          <Route path="/market/sales/add-listing" element={<AddFarmerListing />} />
          <Route path="/market/sales/edit-listing/:listing_id" element={<EditFarmerListing />} />
          <Route path="/admin/users/list" element={<AdminUsersPage/>}/>
          <Route path="/admin/farmers/dashboard" element={<AdminFarmerStatsDashboard />} />
          <Route path="/admin/farmers/market/view" element={<AdminMarketDashboard />} />
          <Route path="/admin/farmers/land/post" element={<AdminPostLand />} />
          <Route path="/admin/farmers/land/view" element={<AdminViewLand/>}/>
          <Route path="/admin/farmers/land/update/:id" element={<AdminUpdateLand />} />
          <Route path="/admin/farmers/livestock/update/:id" element={<AdminUpdateLivestock />} />
          <Route path="/weather" element={<WeatherPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
