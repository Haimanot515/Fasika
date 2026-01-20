import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios"; 
import { HiOutlineTrash, HiOutlineRefresh, HiOutlinePencilAlt, HiOutlineDatabase, HiOutlineUser, HiOutlineOfficeBuilding } from 'react-icons/hi';

const AdminMarketDashboard = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/marketplace/admin/marketplace/listings');
            if (res.data.success) setAds(res.data.listings || []);
        } catch (err) {
            setError("404: Node path unreachable. Check backend mount point.");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (window.confirm(`⚠️ AUTHORITY ACTION: DROP Listing Node #${id}?`)) {
            try {
                // Path must match your adminProductListingRoutes.js
                await api.patch(`/admin/marketplace/admin/marketplace/listings/${id}/archive`);
                alert("LISTING DROPPED SUCCESSFULLY");
                fetchAds(); 
            } catch (err) {
                alert("DROP FAILED: Authority connection error.");
            }
        }
    };

    useEffect(() => { fetchAds(); }, []);

    if (loading) return <div style={styles.loadingScreen}><HiOutlineDatabase className="animate-spin" size={30} /><p>SYNCING REGISTRY...</p></div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.mainTitle}>🛒 MARKETPLACE REGISTRY</h2>
                    <p style={styles.subTitle}>Authority Moderation: Global Product Nodes</p>
                </div>
                <button onClick={fetchAds} style={styles.refreshBtn}><HiOutlineRefresh /> Sync Registry</button>
            </div>

            <div style={styles.gridContainer}>
                {ads.map(ad => (
                    <div key={ad.listing_id} style={styles.card}>
                        <div style={styles.imageBox}>
                            <img src={ad.primary_image_url || 'https://via.placeholder.com/400x250'} alt={ad.product_name} style={styles.productImg} />
                            <div style={{...styles.statusBadge, backgroundColor: ad.status === 'ACTIVE' ? '#22c55e' : '#ef4444'}}>{ad.status}</div>
                        </div>

                        <div style={styles.cardContent}>
                            <div style={styles.metaHeader}>
                                <span style={styles.categoryBadge}>{ad.product_category}</span>
                                <span style={styles.idBadge}>ID: {ad.listing_id}</span>
                            </div>

                            <h3 style={styles.titleText}>{ad.product_name}</h3>

                            {/* OWNER & FARM LOGIC */}
                            <div style={styles.ownerSection}>
                                <div style={styles.infoRow}><HiOutlineUser size={14} /> <span><b>Owner:</b> {ad.owner_name}</span></div>
                                <div style={styles.infoRow}><HiOutlineOfficeBuilding size={14} /> <span><b>Farm:</b> {ad.farm_name}</span></div>
                            </div>

                            <div style={styles.priceContainer}>
                                <span style={styles.currency}>ETB</span>
                                <span style={styles.price}>{parseFloat(ad.price_per_unit).toLocaleString()}</span>
                            </div>

                            <div style={styles.actionGrid}>
                                <button onClick={() => navigate(`/admin/listings/update/${ad.listing_id}`)} style={styles.btnEdit}><HiOutlinePencilAlt /> Update</button>
                                <button onClick={() => handleDrop(ad.listing_id)} style={styles.btnDrop}><HiOutlineTrash /> DROP</button>
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
    mainTitle: { color: '#0f172a', margin: 0, fontWeight: '900', fontSize: '26px' },
    subTitle: { color: '#64748b', fontSize: '14px' },
    refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' },
    imageBox: { position: 'relative', height: '180px' },
    productImg: { width: '100%', height: '100%', objectFit: 'cover' },
    statusBadge: { position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '20px', color: '#fff', fontSize: '10px', fontWeight: 'bold' },
    cardContent: { padding: '20px' },
    metaHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    categoryBadge: { fontSize: '10px', background: '#eff6ff', color: '#1e40af', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' },
    idBadge: { fontSize: '10px', color: '#94a3b8' },
    titleText: { margin: '0 0 15px 0', fontSize: '19px', color: '#1e293b', fontWeight: '700' },
    ownerSection: { background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '15px' },
    infoRow: { display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '12px', marginBottom: '4px' },
    priceContainer: { display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' },
    currency: { fontSize: '12px', fontWeight: '700', color: '#64748b' },
    price: { fontSize: '22px', fontWeight: '900', color: '#0f172a' },
    actionGrid: { display: 'flex', gap: '10px' },
    btnEdit: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#475569' },
    btnDrop: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '10px', background: '#fef2f2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#ef4444' }
};

export default AdminMarketDashboard;
