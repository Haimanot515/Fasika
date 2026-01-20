import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiOutlineTrash, HiOutlineRefresh, HiOutlineMap, HiOutlineSearch, HiOutlineUser } from 'react-icons/hi';

const AdminViewLands = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchIdentity, setSearchIdentity] = useState(''); // Email/Phone/UUID
    const [isFiltered, setIsFiltered] = useState(false);

    const API_URL = 'http://localhost:5000/api/admin/farmers/land';
    
    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // --- LOAD LOGIC (Adjusted for Specific Farmer vs Global) ---
    const loadData = async (identity = '') => {
        setLoading(true);
        try {
            let endpoint = `${API_URL}/view`; // Default: Global View
            
            // If an identity is provided, use the farmer-specific endpoint
            if (identity) {
                endpoint = `${API_URL}/farmer/${identity}`;
                setIsFiltered(true);
            } else {
                setIsFiltered(false);
            }

            const res = await axios.get(endpoint, getAuthHeader());
            if (res.data.success) setLands(res.data.data);
        } catch (err) {
            console.error("Failed to load registry nodes");
            setLands([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadData(searchIdentity);
    };

    const clearFilter = () => {
        setSearchIdentity('');
        loadData();
    };

    const handleDrop = async (id) => {
        if (window.confirm(`⚠️ CRITICAL: Are you sure you want to DROP Land Record #${id}? This action is permanent.`)) {
            try {
                const res = await axios.delete(`${API_URL}/drop/${id}`, getAuthHeader());
                if (res.data.success) {
                    alert("Land record DROPPED successfully");
                    loadData(searchIdentity); // Refresh current view
                }
            } catch (err) {
                alert("DROP operation failed.");
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- STYLES ---
    const tableHeaderStyle = { padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', background: '#f8fafc', color: '#64748b', borderBottom: '2px solid #e2e8f0' };
    const cellStyle = { padding: '15px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#1e293b' };

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            
            {/* Header & Filter Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HiOutlineMap color="#27ae60" /> Agricultural Land Registry
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>
                        {isFiltered ? `Showing nodes for identity: ${searchIdentity}` : "Official records of all registered farm plots."}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Identity Search Bar */}
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '5px', background: '#fff', padding: '5px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <input 
                            type="text" 
                            placeholder="Email / Phone / UUID"
                            value={searchIdentity}
                            onChange={(e) => setSearchIdentity(e.target.value)}
                            style={{ border: 'none', padding: '5px 10px', outline: 'none', fontSize: '14px', width: '200px' }}
                        />
                        <button type="submit" style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}>
                            <HiOutlineSearch />
                        </button>
                    </form>

                    {isFiltered && (
                        <button onClick={clearFilter} style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 15px', cursor: 'pointer', fontSize: '13px' }}>
                            Clear Filter
                        </button>
                    )}

                    <button onClick={() => loadData(searchIdentity)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
                        <HiOutlineRefresh /> Refresh
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>🌍 Syncing Registry...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Node ID</th>
                                <th style={tableHeaderStyle}>Owner Detail</th>
                                <th style={tableHeaderStyle}>Plot Name</th>
                                <th style={tableHeaderStyle}>Area Size</th>
                                <th style={tableHeaderStyle}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lands.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No registered plots match this identity.</td>
                                </tr>
                            ) : lands.map(land => (
                                <tr key={land.id}>
                                    <td style={{ ...cellStyle, fontWeight: 'bold' }}>#{land.id}</td>
                                    <td style={cellStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <HiOutlineUser color="#94a3b8" />
                                            <span>{land.farmer_id}</span> {/* Or land.farmer_name if joined */}
                                        </div>
                                    </td>
                                    <td style={{ ...cellStyle, fontWeight: '500' }}>{land.plot_name}</td>
                                    <td style={cellStyle}>{land.area_size} Hectares</td>
                                    <td style={cellStyle}>
                                        <button onClick={() => handleDrop(land.id)} style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px' }}>
                                            <HiOutlineTrash /> <span style={{ fontWeight: '800', fontSize: '12px' }}>DROP</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminViewLands;
