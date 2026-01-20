import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios"; // Standardized API instance
import { HiOutlineTrash, HiOutlineRefresh, HiOutlinePencilAlt, HiOutlineDatabase } from 'react-icons/hi';

const AdminMarketDashboard = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* =========================
       FETCH REGISTRY DATA
    ========================= */
    const fetchAds = async () => {
        setLoading(true);
        setError(null);
        try {
            // Uses the base URL and auth headers defined in your axios config
            const res = await api.get('/admin/listings/view-all');
            if (res.data.success) {
                setAds(res.data.listings || []);
            }
        } catch (err) {
            console.error("Registry Sync Failed:", err);
            setError("Failed to load Marketplace Registry. Connection Refused by Node.");
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       COMMIT DROP ACTION
    ========================= */
    const handleDrop = async (id) => {
        if (window.confirm(`⚠️ AUTHORITY ACTION: DROP Listing Node #${id}?`)) {
            try {
                // Matches your adminListingController update/delete patterns
                const res = await api.delete(`/admin/listings/listing/${id}/drop`);
                if (res.status === 200 || res.data.success) {
                    alert("LISTING DROPPED SUCCESSFULLY");
                    fetchAds(); // Refresh local state
                }
            } catch (err) {
                alert("DROP FAILED: Record is protected or node is unreachable.");
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
            <div style={styles.header}>
                <div>
                    <h2 style={styles.mainTitle}>🛒 MARKETPLACE REGISTRY</h2>
                    <p style={styles.subTitle}>Authority Moderation for Active Farmer Nodes</p>
                </div>
                <button onClick={fetchAds} style={styles.refreshBtn}>
                    <HiOutlineRefresh /> Sync Data
                </button>
            </div>

            {error && <div style={styles.errorAlert}>{error}</div>}

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>NODE ID</th>
                            <th style={styles.th}>PRODUCT</th>
                            <th style={styles.th}>CATEGORY</th>
                            <th style={styles.th}>PRICE</th>
                            <th style={styles.th}>STATUS</th>
                            <th style={styles.th}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody style={styles.tbody}>
                        {ads.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={styles.emptyCell}>No records found in the Global Registry.</td>
                            </tr>
                        ) : ads.map(ad => (
                            <tr key={ad.listing_id} style={styles.tr}>
                                <td style={styles.idCell}>#{ad.listing_id}</td>
                                <td style={styles.boldCell}>{ad.product_name}</td>
                                <td style={styles.td}>
                                    <span style={styles.categoryBadge}>{ad.product_category}</span>
                                </td>
                                <td style={styles.priceCell}>
                                    ETB {parseFloat(ad.price_per_unit).toLocaleString()}
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        color: ad.status === 'ACTIVE' ? '#166534' : '#991b1b',
                                        backgroundColor: ad.status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2'
                                    }}>
                                        {ad.status}
                                    </span>
                                </td>
                                <td style={styles.actionCell}>
                                    <button 
                                        onClick={() => navigate(`/admin/listings/update/${ad.listing_id}`)}
                                        style={styles.editBtn}
                                    >
                                        <HiOutlinePencilAlt size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDrop(ad.listing_id)}
                                        style={styles.dropBtn}
                                    >
                                        <HiOutlineTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Inline styles maintained for consistency with your previous dashboard structure
const styles = {
    container: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
    loadingScreen: { height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1e40af', gap: '10px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    mainTitle: { color: '#0f172a', margin: 0, fontWeight: '800' },
    subTitle: { color: '#64748b', fontSize: '14px' },
    refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    errorAlert: { padding: '15px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fee2e2' },
    tableWrapper: { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    theadRow: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    th: { padding: '18px 15px', fontSize: '12px', color: '#475569', textTransform: 'uppercase' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '15px' },
    idCell: { padding: '15px', fontWeight: 'bold', color: '#94a3b8' },
    boldCell: { padding: '15px', fontWeight: '600', color: '#1e293b' },
    priceCell: { padding: '15px', fontWeight: '700', color: '#0f172a' },
    categoryBadge: { padding: '4px 10px', background: '#eff6ff', color: '#1e40af', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    actionCell: { padding: '15px', display: 'flex', gap: '8px' },
    editBtn: { background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' },
    dropBtn: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' },
    emptyCell: { padding: '50px', textAlign: 'center', color: '#94a3b8' }
};

export default AdminMarketDashboard;
