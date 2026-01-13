import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminUpdateLand = ({ verifiedId }) => {
    // Priority given to verifiedId from sidebar, fallback to URL params
    const { id } = useParams(); 
    const targetId = verifiedId || id; 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        plot_name: '',
        area_size: '',
        land_status: ''
    });
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // --- INTEGRATED API LOGIC ---
    const API_URL = `http://localhost:5000/api/admin/farmers/land`;
    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // 1. Fetch current details to populate form
    useEffect(() => {
        const fetchLandDetails = async () => {
            setLoading(true);
            try {
                // Fetch all and filter to find specific ID
                const res = await axios.get(`${API_URL}/view`, getHeaders());
                const currentPlot = res.data.data.find(p => p.id === parseInt(targetId));
                
                if (currentPlot) {
                    setFormData({
                        plot_name: currentPlot.plot_name,
                        area_size: currentPlot.area_size,
                        land_status: currentPlot.land_status
                    });
                } else {
                    alert("Plot not found in registry.");
                    navigate('/admin/farmers/dashboard');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                alert("Error fetching plot details from server.");
            } finally {
                setLoading(false);
            }
        };

        if (targetId) fetchLandDetails();
    }, [targetId, navigate]);

    // 2. Handle the update submission
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await axios.patch(`${API_URL}/update/${targetId}`, formData, getHeaders());
            if (res.data.success) {
                alert(`✅ Success: Land Plot #${targetId} updated.`);
                navigate('/admin/farmers/dashboard'); // Redirect to overview
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("Update failed: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdating(false);
        }
    };

    // --- UI RENDER ---
    if (loading) return (
        <div style={{ padding: '50px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>
            🌾 Retrieving Land Registry Data for ID #{targetId}...
        </div>
    );

    return (
        <div style={{ padding: '40px', background: '#f0f4f8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ 
                maxWidth: '500px', 
                margin: '0 auto', 
                padding: '30px', 
                background: '#fff', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0' 
            }}>
                <h2 style={{ color: '#2d3748', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📝 Update Registry
                </h2>
                <p style={{ color: '#718096', fontSize: '14px', marginBottom: '25px' }}>
                    Modifying Land Plot Reference: <strong>#{targetId}</strong>
                </p>
                
                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '14px' }}>Plot Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.plot_name} 
                            onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '14px' }}>Area Size (sqm)</label>
                        <input 
                            type="number" 
                            required
                            value={formData.area_size} 
                            onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '14px' }}>Administrative Status</label>
                        <select 
                            value={formData.land_status} 
                            onChange={(e) => setFormData({...formData, land_status: e.target.value})}
                            style={inputStyle}
                        >
                            <option value="Active">Active</option>
                            <option value="Fallow">Fallow</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                            <option value="Sold">Sold / Transferred</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            style={{ 
                                flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', 
                                background: '#fff', cursor: 'pointer', fontWeight: '600', color: '#718096' 
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isUpdating}
                            style={{ 
                                flex: 1, padding: '12px', background: isUpdating ? '#94a3b8' : '#2980b9', 
                                color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', 
                                cursor: isUpdating ? 'not-allowed' : 'pointer', transition: '0.2s'
                            }}
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Reusable internal style
const inputStyle = { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #cbd5e0', 
    fontSize: '14px',
    boxSizing: 'border-box'
};

export default AdminUpdateLand;