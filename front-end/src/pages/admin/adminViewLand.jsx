import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiOutlineTrash, HiOutlineRefresh, HiOutlineMap } from 'react-icons/hi';

const AdminViewLands = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- INTEGRATED API LOGIC ---
    const API_URL = 'http://localhost:5000/api/admin/farmers/land';
    
    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/view`, getAuthHeader());
            if (res.data.success) setLands(res.data.data);
        } catch (err) {
            console.error("Failed to load land registry");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (window.confirm(`⚠️ CRITICAL: Are you sure you want to DROP Land Record #${id}? This action is permanent.`)) {
            try {
                const res = await axios.delete(`${API_URL}/drop/${id}`, getAuthHeader());
                if (res.data.success) {
                    alert("Land record DROPPED successfully");
                    loadData(); // Refresh table
                }
            } catch (err) {
                alert("DROP operation failed. Ensure you have administrative privileges.");
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- STYLES ---
    const tableHeaderStyle = {
        padding: '15px',
        textAlign: 'left',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: '#f8fafc',
        color: '#64748b',
        borderBottom: '2px solid #e2e8f0'
    };

    const cellStyle = {
        padding: '15px',
        borderBottom: '1px solid #f1f5f9',
        fontSize: '14px',
        color: '#1e293b'
    };

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>
            🌍 Accessing Agricultural Land Registry...
        </div>
    );

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HiOutlineMap color="#27ae60" /> Agricultural Land Registry
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>Official records of registered farm plots and territories.</p>
                </div>
                <button 
                    onClick={loadData} 
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', 
                        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', 
                        cursor: 'pointer', fontWeight: '600', color: '#475569'
                    }}
                >
                    <HiOutlineRefresh /> Refresh Registry
                </button>
            </div>

            {/* Table Container */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>ID</th>
                            <th style={tableHeaderStyle}>Farm Name</th>
                            <th style={tableHeaderStyle}>Plot Name</th>
                            <th style={tableHeaderStyle}>Area Size</th>
                            <th style={tableHeaderStyle}>Status</th>
                            <th style={tableHeaderStyle}>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lands.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                    No registered land plots found in the database.
                                </td>
                            </tr>
                        ) : lands.map(land => (
                            <tr key={land.id} style={{ transition: '0.2s' }}>
                                <td style={{ ...cellStyle, fontWeight: 'bold' }}>#{land.id}</td>
                                <td style={cellStyle}>{land.farm_name || 'N/A'}</td>
                                <td style={{ ...cellStyle, fontWeight: '500' }}>{land.plot_name}</td>
                                <td style={cellStyle}>{land.area_size} sqm</td>
                                <td style={cellStyle}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '20px', 
                                        fontSize: '11px', 
                                        fontWeight: '700',
                                        background: land.land_status === 'Active' ? '#dcfce7' : '#fef2f2',
                                        color: land.land_status === 'Active' ? '#166534' : '#ef4444'
                                    }}>
                                        {land.land_status}
                                    </span>
                                </td>
                                <td style={cellStyle}>
                                    <button 
                                        onClick={() => handleDrop(land.id)}
                                        style={{ 
                                            background: 'none', border: 'none', color: '#ef4444', 
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                                            padding: '5px', borderRadius: '4px'
                                        }}
                                        title="Drop Record"
                                    >
                                        <HiOutlineTrash /> <span style={{ fontWeight: '800', fontSize: '12px' }}>DROP</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
                * Registry data is protected by administrative encryption. DROP actions are logged.
            </div>
        </div>
    );
};

export default AdminViewLands;