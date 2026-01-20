import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios"; 
import { HiOutlineTrash, HiOutlineRefresh, HiOutlinePencilAlt, HiOutlineDatabase, HiOutlineUser } from 'react-icons/hi';

const AdminMarketDashboard = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAds = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/admin/marketplace/admin/marketplace/listings');
            if (res.data.success) {
                setAds(res.data.listings || []);
            }
        } catch (err) {
            setError("404: Registry Sync Failed. Check Node Path.");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (window.confirm(`⚠️ AUTHORITY ACTION: DROP Listing Node #${id}?`)) {
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
                    <p style={styles.subTitle}>Authority Grid View: Managing Global Farmer Nodes</p>
                </div>
                <button onClick={fetchAds} style={styles.refreshBtn}>
                    <HiOutlineRefresh /> Sync Data
                </button>
            </div>

            {error && <div style={styles.errorAlert}>{error}</div>}

            {ads.length === 0 ? (
                <div style={styles.emptyState}>No records found in the Global Registry.</div>
            ) : (
                <div style={styles.gridContainer}>
                    {ads.map(ad => (
                        <div key={ad.listing_id} style={styles.card}>
                            {/* Product Image */}
                            <div style={styles.imageWrapper}>
                                <img 
                                    src={ad.primary_image_url || 'https://via.placeholder.com/300?text=No+Image'} 
                                    alt={ad.product_name} 
                                    style={styles.image}
                                />
                                <span style={{
                                    ...styles.statusBadge,
                                    backgroundColor: ad.status === 'ACTIVE' ? '#22c55e' : '#ef4444'
                                }}>
                                    {ad.status}
                                </span>
                            </div>

                            {/* Content */}
                            <div style={styles.cardBody}>
                                <div style={styles.categoryRow}>
                                    <span style={styles.categoryTag}>{ad.product_category}</span>
                                    <span style={styles.idTag}>#{ad.listing_id}</span>
                                </div>
                                
                                <h3 style={styles.productTitle}>{ad.product_name}</h3>
                                
                                <div style={styles.ownerRow}>
                                    <HiOutlineUser color="#64748b" />
                                    <span style={styles.ownerText}>{ad.owner_name || 'Anonymous Farmer'}</span>
                                </div>

                                <div style={styles.priceTag}>
                                    ETB {parseFloat(ad.price_per_unit).toLocaleString()}
                                </div>

                                {/* Actions */}
                                <div style={styles.actionRow}>
                                    <button 
                                        onClick={() => navigate(`/admin/listings/update/${ad.listing_id}`)}
                                        style={styles.editBtn}
                                    >
                                        <HiOutlinePencilAlt size={18} /> Update
                                    </button>
                                    <button 
                                        onClick={() => handleDrop(ad.listing_id)}
                                        style={styles.dropBtn}
                                    >
                                        <HiOutlineTrash size={18} /> DROP
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '40px', background: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' },
    loadingScreen: { height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1e40af' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    mainTitle: { color: '#0f172a', margin: 0, fontWeight: '900', letterSpacing: '-1px' },
    subTitle: { color: '#64748b', fontSize: '14px' },
    refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
    card: { background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', transition: '0.3s' },
    imageWrapper: { position: 'relative', height: '180px', width: '100%', background: '#f8fafc' },
    image: { width: '100%', height: '100%', objectFit: 'cover' },
    statusBadge: { position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', color: '#fff', borderRadius: '6px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' },
    cardBody: { padding: '15px' },
    categoryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    categoryTag: { fontSize: '10px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' },
    idTag: { fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' },
    productTitle: { margin: '0 0 10px 0', fontSize: '18px', color: '#1e293b', fontWeight: '700' },
    ownerRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px' },
    ownerText: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
    priceTag: { fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '20px' },
    actionRow: { display: 'flex', gap: '10px' },
    editBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#475569' },
    dropBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '10px', background: '#fef2f2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#ef4444' },
    emptyState: { textAlign: 'center', padding: '100px', color: '#94a3b8', fontSize: '18px' }
};

export default AdminMarketDashboard;
