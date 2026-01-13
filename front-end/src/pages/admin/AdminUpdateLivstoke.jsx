import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminUpdateLivestock = ({ verifiedId }) => {
    // Note: uses targetId from either the Sidebar state or the URL path
    const { id } = useParams();
    const targetId = verifiedId || id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        health_status: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // --- INTEGRATED API LOGIC ---
    const API_BASE = 'http://localhost:5000/api/admin/farmers/livestock';
    
    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // 1. Load existing data on mount
    useEffect(() => {
        const fetchLivestockDetails = async () => {
            setLoading(true);
            try {
                // Fetching all to filter for the specific ID
                const res = await axios.get(`${API_BASE}/view`, getHeaders());
                const record = res.data.data.find(l => l.id === parseInt(targetId));
                
                if (record) {
                    setFormData({
                        health_status: record.health_status,
                        quantity: record.quantity
                    });
                } else {
                    alert("Livestock record not found.");
                    navigate('/admin/farmers/dashboard');
                }
            } catch (err) {
                console.error("Livestock fetch error:", err);
                alert("Error connecting to Livestock Registry.");
            } finally {
                setLoading(false);
            }
        };

        if (targetId) fetchLivestockDetails();
    }, [targetId, navigate]);

    // 2. Handle Update Submission
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await axios.patch(`${API_BASE}/update/${targetId}`, formData, getHeaders());
            if (res.data.success) {
                alert(`✅ Livestock ID: ${targetId} updated successfully.`);
                navigate('/admin/farmers/dashboard');
            }
        } catch (err) {
            console.error("Update failed:", err);
            alert("Update failed: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdating(false);
        }
    };

    // --- UI RENDER ---
    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#4a5568' }}>
            🐄 Syncing with Livestock Registry for ID #{targetId}...
        </div>
    );

    return (
        <div style={{ padding: '40px', background: '#f7fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <div style={{ 
                maxWidth: '500px', 
                margin: '0 auto', 
                padding: '30px', 
                background: '#fff', 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
                border: '1px solid #edf2f7' 
            }}>
                <h2 style={{ 
                    color: '#2c3e50', 
                    marginBottom: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px' 
                }}>
                    🐄 Update Livestock Record
                </h2>
                <p style={{ color: '#718096', fontSize: '14px', marginBottom: '30px' }}>
                    Registry Reference: <strong>#{targetId}</strong>
                </p>
                
                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Health Status</label>
                        <select 
                            value={formData.health_status} 
                            onChange={(e) => setFormData({...formData, health_status: e.target.value})}
                            style={inputStyle}
                        >
                            <option value="Healthy">Healthy</option>
                            <option value="Sick">Sick</option>
                            <option value="Quarantined">Quarantined</option>
                            <option value="Vaccinated">Vaccinated</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={labelStyle}>Quantity / Head Count</label>
                        <input 
                            type="number" 
                            required
                            value={formData.quantity} 
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            style={{ 
                                flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', 
                                background: 'white', cursor: 'pointer', fontWeight: '600', color: '#4a5568' 
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
                                cursor: isUpdating ? 'not-allowed' : 'pointer' 
                            }}
                        >
                            {isUpdating ? 'Saving...' : 'Update Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Internal styles
const labelStyle = { display: 'block', fontWeight: '700', marginBottom: '8px', color: '#4a5568', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' };

export default AdminUpdateLivestock;