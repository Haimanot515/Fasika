import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiOutlineTrash, HiOutlineRefresh } from 'react-icons/hi';

const AdminMarketDashboard = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- INTEGRATED API LOGIC ---
    const API_BASE_URL = 'http://localhost:5000/api/admin/farmers';
    
    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchAds = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/market/view`, getAuthHeader());
            if (res.data.success) {
                setAds(res.data.data);
            }
        } catch (err) {
            console.error("Failed to load market ads");
            setError("Could not retrieve market data. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (window.confirm(`⚠️ SECURITY ACTION: Are you sure you want to DROP Market Ad #${id}?`)) {
            try {
                const res = await axios.delete(`${API_BASE_URL}/market/drop/${id}`, getAuthHeader());
                if (res.data.success) {
                    alert("Listing DROPPED successfully");
                    fetchAds(); // Refresh table
                }
            } catch (err) {
                alert("DROP operation failed. Record may be protected or already removed.");
            }
        }
    };

    useEffect(() => { 
        fetchAds(); 
    }, []);

    // --- RENDER ---
    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>
            🌾 Loading Market Registry...
        </div>
    );

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h2 style={{ color: '#1e293b', margin: 0 }}>🛒 Global Market Listings</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>Moderation panel for active farmer advertisements.</p>
                </div>
                <button 
                    onClick={fetchAds} 
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', 
                        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', 
                        cursor: 'pointer', fontWeight: '600', color: '#475569', transition: '0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                    onMouseOut={(e) => e.target.style.background = '#fff'}
                >
                    <HiOutlineRefresh /> Refresh Data
                </button>
            </div>

            {error && (
                <div style={{ padding: '15px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fee2e2' }}>
                    {error}
                </div>
            )}

            {/* Table Container */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '18px 15px', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                            <th style={{ padding: '18px 15px', borderBottom: '1px solid #e2e8f0' }}>Product Title</th>
                            <th style={{ padding: '18px 15px', borderBottom: '1px solid #e2e8f0' }}>Category</th>
                            <th style={{ padding: '18px 15px', borderBottom: '1px solid #e2e8f0' }}>Price</th>
                            <th style={{ padding: '18px 15px', borderBottom: '1px solid #e2e8f0' }}>Date Posted</th>
                            <th style={{ padding: '18px 15px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '14px', color: '#1e293b' }}>
                        {ads.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8' }}>
                                    No active market ads found in the registry.
                                </td>
                            </tr>
                        ) : ads.map(ad => (
                            <tr key={ad.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row">
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#64748b' }}>#{ad.id}</td>
                                <td style={{ padding: '15px', fontWeight: '500' }}>{ad.title}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ padding: '4px 10px', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                                        {ad.category}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', fontWeight: '700', color: '#0f172a' }}>
                                    ETB {parseFloat(ad.price).toLocaleString()}
                                </td>
                                <td style={{ padding: '15px', color: '#64748b' }}>
                                    {new Date(ad.created_at).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button 
                                        onClick={() => handleDrop(ad.id)}
                                        style={{ 
                                            background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', 
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '6px 12px', borderRadius: '6px', transition: '0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#fee2e2'}
                                        onMouseOut={(e) => e.target.style.background = '#fef2f2'}
                                    >
                                        <HiOutlineTrash size={16} /> 
                                        <span style={{ fontWeight: '700', fontSize: '12px' }}>DROP</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#94a3b8', textAlign: 'right' }}>
                * All DROP actions are permanent and recorded in admin logs.
            </div>
        </div>
    );
};

export default AdminMarketDashboard;