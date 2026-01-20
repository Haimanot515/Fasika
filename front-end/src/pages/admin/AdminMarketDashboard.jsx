import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios"; 
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
            // FIX: Match the path in app.js + the path in adminProductListingRoutes.js
            // app.use('/api/admin/marketplace', ...) + router.get('/admin/marketplace/listings', ...)
            // Depending on your router setup, this is the most likely correct path:
            const res = await api.get('/admin/marketplace/admin/marketplace/listings');
            
            if (res.data.success) {
                setAds(res.data.listings || []);
            }
        } catch (err) {
            console.error("Registry Sync Failed:", err);
            setError("404: Node Path Not Found. Check Registry Routing.");
        } finally {
            setLoading(false);
        }
    };

    /* =========================
        COMMIT DROP ACTION
    ========================= */
    const handleDrop = async (id) => {
        // As per instructions: Always use 'DROP'
        if (window.confirm(`⚠️ AUTHORITY ACTION: Are you sure you want to DROP Listing Node #${id}?`)) {
            try {
                // FIX: Match your router's archive path as the DROP mechanism
                const res = await api.patch(`/admin/marketplace/admin/marketplace/listings/${id}/archive`);
                
                if (res.status === 200 || res.data.success) {
                    alert("LISTING DROPPED SUCCESSFULLY");
                    fetchAds(); 
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

// ... (styles remain the same)
export default AdminMarketDashboard;
