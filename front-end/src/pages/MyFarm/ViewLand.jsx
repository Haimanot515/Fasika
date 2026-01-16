import React, { useState, useEffect } from 'react';
import api from "../../api/axios"; 
import UpdateLand from "./UpdateLand"; // The component we just created
import { 
  Trash2, Edit3, Map, Maximize, Activity, 
  Layers, Loader2, Search, AlertCircle, Plus 
} from 'lucide-react';

const ViewLand = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingPlotId, setEditingPlotId] = useState(null); // Track which plot is being edited

    const fetchLands = async () => {
        setLoading(true);
        try {
            const res = await api.get('/farmer/farm/land');
            setLands(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Registry Sync Error:", err);
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (window.confirm("CRITICAL: Are you sure you want to DROP this asset from the registry?")) {
            try {
                await api.delete(`/farmer/farm/land/${id}`);
                setLands(lands.filter(plot => plot.id !== id));
            } catch (err) {
                alert("DROP failed. Registry node unreachable.");
            }
        }
    };

    useEffect(() => { fetchLands(); }, []);

    // If a user clicks 'Edit', show the UpdateLand component instead of the list
    if (editingPlotId) {
        return (
            <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                    <UpdateLand 
                        plotId={editingPlotId} 
                        onUpdateSuccess={() => {
                            setEditingPlotId(null);
                            fetchLands();
                        }} 
                        onCancel={() => setEditingPlotId(null)} 
                    />
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header Row */}
            <div style={styles.headerRow}>
                <div>
                    <div style={styles.badge}><Layers size={14} /> SMART FARM OS</div>
                    <h1 style={styles.mainTitle}>Land <span style={styles.italicTitle}>Registry</span></h1>
                </div>
                
                <div style={styles.statsBox}>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>NODES</span>
                        <span style={styles.statValue}>{lands.length}</span>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div style={styles.searchBar}>
                <Search style={styles.searchIcon} size={20} />
                <input 
                    style={styles.searchInput}
                    placeholder="Search registry by plot name..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div style={styles.centerBlock}>
                    <Loader2 style={styles.spinner} size={50} />
                    <p style={styles.loadingText}>SYNCHRONIZING REGISTRY...</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {lands.filter(p => p.plot_name.toLowerCase().includes(searchTerm.toLowerCase())).map((plot) => (
                        <div key={plot.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={styles.cardIcon}><Map size={24} /></div>
                                <div>
                                    <h3 style={styles.cardTitle}>{plot.plot_name}</h3>
                                    <p style={styles.cardSubtitle}>ID: 0x{plot.id.toString().padStart(4, '0')}</p>
                                </div>
                            </div>

                            <div style={styles.cardBody}>
                                <div style={styles.dataRow}>
                                    <div style={styles.dataIcon}><Maximize size={16} /></div>
                                    <span style={styles.dataLabel}>Area:</span>
                                    <span style={styles.dataValue}>{plot.area_size} Ha</span>
                                </div>
                                <div style={styles.dataRow}>
                                    <div style={styles.dataIcon}><Activity size={16} /></div>
                                    <span style={styles.dataLabel}>Status:</span>
                                    <span style={{
                                        ...styles.statusTag, 
                                        backgroundColor: plot.land_status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                                        color: plot.land_status === 'Active' ? '#10b981' : '#64748b'
                                    }}>
                                        {plot.land_status}
                                    </span>
                                </div>
                            </div>

                            <div style={styles.cardActions}>
                                <button 
                                    onClick={() => setEditingPlotId(plot.id)}
                                    style={styles.editBtn}
                                >
                                    <Edit3 size={18} /> EDIT
                                </button>
                                <button 
                                    onClick={() => handleDrop(plot.id)}
                                    style={styles.dropBtn}
                                >
                                    <Trash2 size={18} /> DROP
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '60px', backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    badge: { display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '800', fontSize: '11px', letterSpacing: '2px', marginBottom: '10px' },
    mainTitle: { fontSize: '40px', fontWeight: '900', color: '#0f172a', margin: 0 },
    italicTitle: { color: '#10b981', fontWeight: '300', fontStyle: 'italic' },
    statsBox: { backgroundColor: '#fff', padding: '15px 30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' },
    statLabel: { fontSize: '10px', fontWeight: '900', color: '#94a3b8' },
    statValue: { fontSize: '24px', fontWeight: '900', color: '#10b981', marginLeft: '10px' },
    searchBar: { position: 'relative', marginBottom: '40px', maxWidth: '500px' },
    searchIcon: { position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' },
    searchInput: { width: '100%', padding: '18px 18px 18px 55px', borderRadius: '18px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: '600', fontSize: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
    card: { backgroundColor: '#fff', borderRadius: '28px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' },
    cardHeader: { padding: '25px', display: 'flex', gap: '15px', alignItems: 'center', borderBottom: '1px solid #f8fafc' },
    cardIcon: { padding: '12px', backgroundColor: '#f0fdf4', color: '#10b981', borderRadius: '14px' },
    cardTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' },
    cardSubtitle: { margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: '700' },
    cardBody: { padding: '25px' },
    dataRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
    dataIcon: { color: '#cbd5e1' },
    dataLabel: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
    dataValue: { fontSize: '14px', fontWeight: '700', color: '#0f172a' },
    statusTag: { padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' },
    cardActions: { padding: '20px 25px', backgroundColor: '#f8fafc', display: 'flex', gap: '10px' },
    editBtn: { flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    dropBtn: { flex: 1, padding: '12px', backgroundColor: '#fff1f2', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' },
    modalContent: { width: '100%', maxWidth: '600px', padding: '20px' },
    centerBlock: { textAlign: 'center', padding: '100px 0' },
    spinner: { color: '#10b981', animation: 'spin 2s linear infinite' },
    loadingText: { marginTop: '20px', fontSize: '12px', fontWeight: '900', color: '#cbd5e1', letterSpacing: '2px' }
};

export default ViewLand;
