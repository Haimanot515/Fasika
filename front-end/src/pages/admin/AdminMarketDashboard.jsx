import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import axios from 'axios';
import { HiOutlineTrash, HiOutlineRefresh, HiOutlinePencilAlt, HiOutlineDatabase } from 'react-icons/hi';

const AdminMarketDashboard = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- INTEGRATED API LOGIC ---
    // Updated to match your marketplace routing structure
    const API_BASE_URL = 'http://localhost:5000/api/admin/listings';
    
    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchAds = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/view-all`, getAuthHeader());
            if (res.data.success) {
                // Using 'listings' based on your controller response
                setAds(res.data.listings || []);
            }
        } catch (err) {
            console.error("Failed to load market ads");
            setError("Registry Sync Failed: Check backend authority connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        // Strict adherence to your 'DROP' requirement
        if (window.confirm(`⚠️ AUTHORITY ALERT: DROP Listing Node #${id} permanently?`)) {
            try {
                // Adjusting path to match common admin patterns
                const res = await axios.delete(`${API_BASE_URL}/listing/${id}/drop`, getAuthHeader());
                if (res.status === 200) {
                    alert("LISTING DROPPED FROM GLOBAL REGISTRY");
                    fetchAds(); 
                }
            } catch (err) {
                alert("DROP FAILED: Unauthorized or active order constraint.");
            }
        }
    };

    useEffect(() => { 
        fetchAds(); 
    }, []);

    if (loading) return (
        <div style={styles.loadingScreen}>
            <HiOutlineDatabase className="animate-spin" size={30} />
            <p>SYNCING MARKETPLACE REGISTRY...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.mainTitle}>🛒 MARKETPLACE AUTHORITY</h2>
                    <p style={styles.subTitle}>Managing Global Listings & Seller Nodes</p>
                </div>
                <button onClick={fetchAds} style={styles.refreshBtn}>
                    <HiOutlineRefresh /> Refresh Registry
                </button>
            </div>

            {error && <div style={styles.errorAlert}>{error}</div>}

            {/* Table Container */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>NODE ID</th>
                            <th style={styles.th}>PRODUCT NAME</th>
                            <th style={styles.th}>CATEGORY</th>
                            <th style={styles.th}>PRICE (UNIT)</th>
                            <th style={styles.th}>STATUS</th>
                            <th style={styles.th}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody style={styles.tbody}>
                        {ads.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={styles.emptyCell}>
                                    No active market nodes detected in the registry.
                                </td>
                            </tr>
                        ) : ads.map(ad => (
                            <tr key={ad.listing_id} style={styles.tr}>
                                <td style={styles.idCell}>#{ad.listing_id}</td>
                                <td style={{ padding: '15px', fontWeight: '600' }}>{ad.product_name}</td>
                                <td style={styles.td}>
                                    <span style={styles.categoryBadge}>{ad.product_category}</span>
                                </td>
                                <td style={styles.priceCell}>
                                    ETB {parseFloat(ad.price_per_unit).toLocaleString()} <span style={{fontSize: '10px', color: '#64748b'}}>/ {ad.unit}</span>
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: ad.status === 'ACTIVE' ? '#f0fdf4' : '#fff7ed',
                                        color: ad.status === 'ACTIVE' ? '#166534' : '#9a3412'
                                    }}>
                                        {ad.status}
                                    </span>
                                </td>
                                <td style={styles.actionCell}>
                                    {/* EDIT BUTTON: Navigates to the update form created earlier */}
                                    <button 
                                        onClick={() => navigate(`/admin/listings/update/${ad.listing_id}`)}
                                        style={styles.editBtn}
                                        title="Update Node"
                                    >
                                        <HiOutlinePencilAlt size={18} />
                                    </button>

                                    {/* DROP BUTTON */}
                                    <button 
                                        onClick={() => handleDrop(ad.listing_id)}
                                        style={styles.dropBtn}
                                        title="DROP Record"
                                    >
                                        <HiOutlineTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div style={styles.footerNote}>
                * All DROP actions are final. Synchronized with Authority Audit Logs.
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    loadingScreen: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1e40af', gap: '15px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    mainTitle: { color: '#0f172a', margin: 0, fontWeight: '900', letterSpacing: '-0.5px' },
    subTitle: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
    refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', color: '#475569' },
    errorAlert: { padding: '15px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '25px', border: '1px solid #fee2e2', fontWeight: '600' },
    tableWrapper: { background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse' },
    theadRow: { background: '#f1f5f9', textAlign: 'left' },
    th: { padding: '18px', fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
    tr: { borderBottom: '1px solid #f1f5f9', transition: '0.2s' },
    td: { padding: '15px' },
    idCell: { padding: '15px', fontWeight: 'bold', color: '#94a3b8', fontSize: '13px' },
    priceCell: { padding: '15px', fontWeight: '800', color: '#0f172a' },
    categoryBadge: { padding: '4px 12px', background: '#eff6ff', color: '#1e40af', borderRadius: '8px', fontSize: '11px', fontWeight: '700' },
    statusBadge: { padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' },
    actionCell: { padding: '15px', display: 'flex', gap: '10px' },
    editBtn: { background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    dropBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    emptyCell: { padding: '60px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' },
    footerNote: { marginTop: '20px', fontSize: '11px', color: '#94a3b8', textAlign: 'right', fontWeight: '600' }
};

export default AdminMarketDashboard;
