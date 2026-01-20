import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios"; 
import { HiOutlineTrash, HiOutlineRefresh, HiOutlinePencilAlt, HiOutlineDatabase, HiOutlineUser, HiOutlineLocationMarker } from 'react-icons/hi';

const AdminMarketDashboard = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAds = async () => {
        setLoading(true);
        setError(null);
        try {
            // Updated Path to match your Registry Mounting
            const res = await api.get('/admin/marketplace/admin/marketplace/listings');
            if (res.data.success) {
                setAds(res.data.listings || []);
            }
        } catch (err) {
            setError("404: Registry Sync Failed. Node path unreachable.");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        // [Requirement]: Always use 'DROP'
        if (window.confirm(`⚠️ AUTHORITY ACTION: Are you sure you want to DROP Listing Node #${id}?`)) {
            try {
                const res = await api.patch(`/admin/marketplace/admin/marketplace/listings/${id}/archive`);
                if (res.status === 200 || res.data.success) {
                    alert("LISTING DROPPED SUCCESSFULLY");
                    fetchAds(); 
                }
            } catch (err) {
                alert("DROP FAILED: Authority connection error.");
            }
        }
    };

    useEffect(() => { fetchAds(); }, []);

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
                    <p style={styles.subTitle}>Moderation Grid for Verified Farmer Nodes</p>
                </div>
                <button onClick={fetchAds} style={styles.refreshBtn}>
                    <HiOutlineRefresh /> Sync Data
                </button>
            </div>

            {error && <div style={styles.errorAlert}>{error}</div>}

            <div style={styles.gridContainer}>
                {ads.length === 0 ? (
                    <div style={styles.emptyState}>No active listings found in the Global Registry.</div>
                ) : ads.map(ad => (
                    <div key={ad.listing_id} style={styles.card}>
                        {/* Listing Image */}
                        <div style={styles.imageBox}>
                            <img 
                                src={ad.primary_image_url || 'https://via.placeholder.com/400x250?text=No+Product+Image'} 
                                alt={ad.product_name} 
                                style={styles.productImg}
                            />
                            <div style={{
                                ...styles.statusBadge,
                                backgroundColor: ad.status === 'ACTIVE' ? '#22c55e' : '#ef4444'
                            }}>
                                {ad.status}
                            </div>
                        </div>

                        {/* Node Details */}
                        <div style={styles.cardContent}>
                            <div style={styles.metaHeader}>
                                <span style={styles.categoryBadge}>{ad.product_category}</span>
                                <span style={styles.idBadge}>NODE ID: {ad.listing_id}</span>
                            </div>

                            <h3 style={styles.titleText}>{ad.product_name}</h3>

                            {/* Linked Farmer Data from public.farmers */}
                            <div style={styles.farmerInfo}>
                                <div style={styles.infoRow}>
                                    <HiOutlineUser size={14} />
                                    <span>{ad.farm_name || 'Individual Farmer'}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <HiOutlineLocationMarker size={14} />
                                    <span>{ad.farmer_type || 'General Member'}</span>
                                </div>
                            </div>

                            <div style={styles.priceContainer}>
                                <span style={styles.currency}>ETB</span>
                                <span style={styles.price}>{parseFloat(ad.price_per_unit).toLocaleString()}</span>
                            </div>

                            <div style={styles.actionGrid}>
                                <button 
                                    onClick={() => navigate(`/admin/listings/update/${ad.listing_id}`)}
                                    style={styles.btnEdit}
                                >
                                    <HiOutlinePencilAlt /> Update
                                </button>
                                <button 
                                    onClick={() => handleDrop(ad.listing_id)}
                                    style={styles.btnDrop}
                                >
                                    <HiOutlineTrash /> DROP
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '30px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    loadingScreen: { height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1e40af', gap: '15px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' },
    mainTitle: { color: '#0f172a', margin: 0, fontWeight: '800', fontSize: '28px' },
    subTitle: { color: '#64748b', fontSize: '14px', margin: '5px 0 0 0' },
    refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' },
    imageBox: { position: 'relative', height: '190px', width: '100%' },
    productImg: { width: '100%', height: '100%', objectFit: 'cover' },
    statusBadge: { position: 'absolute', top: '15px', right: '15px', padding: '5px 12px', borderRadius: '20px', color: '#fff', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' },
    cardContent: { padding: '20px' },
    metaHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
    categoryBadge: { fontSize: '10px', background: '#f0f9ff', color: '#0369a1', padding: '3px 10px', borderRadius: '5px', fontWeight: '700' },
    idBadge: { fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' },
    titleText: { margin: '0 0 10px 0', fontSize: '20px', color: '#1e293b', fontWeight: '700' },
    farmerInfo: { borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', margin: '15px 0' },
    infoRow: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', marginBottom: '5px' },
    priceContainer: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '20px' },
    currency: { fontSize: '14px', fontWeight: '700', color: '#64748b' },
    price: { fontSize: '24px', fontWeight: '900', color: '#0f172a' },
    actionGrid: { display: 'flex', gap: '10px' },
    btnEdit: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
    btnDrop: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
    errorAlert: { padding: '15px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '25px', border: '1px solid #fee2e2' },
    emptyState: { gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#94a3b8', fontSize: '18px' }
};

export default AdminMarketDashboard;
