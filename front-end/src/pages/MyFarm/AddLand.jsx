import React, { useState, useEffect } from 'react';
import api from "../../api/axios"; 
import { 
  Plus, Trash2, Map, Maximize, Activity, Search, 
  MapPin, Info, Loader2, Wheat, TreePine, 
  Settings2, Layers, AlertCircle
} from 'lucide-react';

const AddLand = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [authError, setAuthError] = useState(false);
    const [formData, setFormData] = useState({ plot_name: '', area_size: '', land_status: 'Active' });

    const LAND_PATH = '/farmer/farm/land';

    const fetchLands = async () => {
        setLoading(true);
        try {
            const res = await api.get(LAND_PATH);
            setLands(res.data.data || []);
            setAuthError(false);
        } catch (err) {
            if (err.response?.status === 401) setAuthError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLand = async (e) => {
        e.preventDefault();
        try {
            await api.post(LAND_PATH, formData);
            setFormData({ plot_name: '', area_size: '', land_status: 'Active' });
            fetchLands();
            alert("Success! Asset DROPPED into the registry.");
        } catch (err) {
            alert(err.response?.data?.message || "Registry entry failed.");
        }
    };

    const handleDropLand = async (id) => {
        if (window.confirm("Are you sure you want to DROP this plot?")) {
            try {
                await api.delete(`${LAND_PATH}/${id}`);
                fetchLands();
            } catch (err) {
                alert("DROP failed.");
            }
        }
    };

    useEffect(() => { fetchLands(); }, []);

    const filteredLands = lands.filter(plot => 
        plot.plot_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            {/* LEFT PANEL */}
            <div style={styles.leftPanel}>
                <div style={styles.brandSection}>
                    <div style={styles.badge}><Layers size={14} /> SMART FARM OS</div>
                    <h1 style={styles.mainTitle}>DROP <br /><span style={styles.italicTitle}>Registry</span></h1>
                </div>

                {authError && (
                    <div style={styles.errorBox}>
                        <AlertCircle size={18} /> <span>Session expired. Please login.</span>
                    </div>
                )}

                <form onSubmit={handleAddLand} style={styles.form}>
                    <div style={styles.inputWrapper}>
                        <label style={styles.label}>Plot Name</label>
                        <div style={styles.inputContainer}>
                            <MapPin style={styles.inputIcon} size={20} />
                            <input 
                                style={styles.input} 
                                value={formData.plot_name}
                                onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                                placeholder="e.g. North Valley" required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputWrapper}>
                        <label style={styles.label}>Area Size (Ha)</label>
                        <div style={styles.inputContainer}>
                            <Maximize style={styles.inputIcon} size={20} />
                            <input 
                                style={styles.input} 
                                type="number" step="0.01"
                                value={formData.area_size}
                                onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                                placeholder="0.00" required 
                            />
                        </div>
                    </div>

                    <button type="submit" style={styles.submitBtn}>
                        <Plus size={22} /> REGISTER ASSET
                    </button>
                </form>

                <div style={styles.infoCard}>
                    <div style={styles.infoIcon}><Info size={20} /></div>
                    <p style={styles.infoText}>Data synced with <b>Secure DROP Node</b>.</p>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={styles.rightPanel}>
                <div style={styles.headerRow}>
                    <div style={styles.searchSection}>
                        <h2 style={styles.sectionLabel}>Registry Explorer</h2>
                        <div style={styles.searchContainer}>
                            <Search style={styles.searchIcon} size={22} />
                            <input 
                                style={styles.searchInput}
                                placeholder="Filter plot identity..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={styles.statusBox}>
                        <div style={{textAlign:'right'}}>
                            <p style={styles.statusLabel}>System Status</p>
                            <p style={styles.statusValue}>Verified Node</p>
                        </div>
                        <div style={styles.statusIcon}><Activity size={24} /></div>
                    </div>
                </div>

                <div style={styles.grid}>
                    {loading ? (
                        <div style={styles.centerBlock}>
                            <Loader2 style={styles.spinner} size={60} />
                            <span style={styles.loadingText}>Synchronizing...</span>
                        </div>
                    ) : filteredLands.map((plot, index) => (
                        <div key={plot.id} style={styles.card}>
                            <div style={styles.pulseDot}></div>
                            <div style={styles.cardHeader}>
                                <div style={{...styles.iconBox, backgroundColor: index % 2 === 0 ? '#fff7ed' : '#f0f9ff', color: index % 2 === 0 ? '#c2410c' : '#0369a1'}}>
                                    {index % 2 === 0 ? <Wheat size={36} /> : <TreePine size={36} />}
                                </div>
                                <div>
                                    <h3 style={styles.cardTitle}>{plot.plot_name}</h3>
                                    <p style={styles.cardId}>REG: {plot.id?.toString().slice(0, 8)}</p>
                                </div>
                            </div>
                            <div style={styles.cardFooter}>
                                <div>
                                    <p style={styles.label}>Calculated Area</p>
                                    <div style={styles.areaDisplay}>
                                        <span style={styles.areaValue}>{plot.area_size}</span>
                                        <span style={styles.areaUnit}>Ha</span>
                                    </div>
                                </div>
                                <div style={styles.actionGroup}>
                                    <button style={styles.actionBtn}><Settings2 size={22} /></button>
                                    <button onClick={() => handleDropLand(plot.id)} style={styles.dropBtn}><Trash2 size={22} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#fcfcfc', fontFamily: '"Inter", sans-serif' },
    leftPanel: { width: '420px', backgroundColor: '#fff', borderRight: '1px solid #f1f5f9', padding: '60px 40px', display: 'flex', flexDirection: 'column', boxShadow: '10px 0 30px rgba(0,0,0,0.02)', zIndex: 10 },
    brandSection: { marginBottom: '50px' },
    badge: { display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '800', fontSize: '11px', letterSpacing: '2px', marginBottom: '15px' },
    mainTitle: { fontSize: '48px', fontWeight: '900', color: '#0f172a', lineHeight: '1.1', margin: 0 },
    italicTitle: { color: '#10b981', fontWeight: '300', fontStyle: 'italic' },
    errorBox: { padding: '15px', backgroundColor: '#fff1f2', borderRadius: '16px', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', marginBottom: '30px', border: '1px solid #ffe4e6' },
    form: { display: 'flex', flexDirection: 'column', gap: '25px' },
    label: { fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', display: 'block' },
    inputContainer: { position: 'relative' },
    inputIcon: { position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' },
    input: { width: '100%', padding: '18px 18px 18px 55px', backgroundColor: '#f8fafc', border: '2px solid transparent', borderRadius: '20px', outline: 'none', transition: '0.3s', fontWeight: '700', boxSizing: 'border-box' },
    submitBtn: { padding: '20px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s', marginTop: '10px', boxShadow: '0 10px 20px rgba(15, 23, 42, 0.1)' },
    infoCard: { marginTop: 'auto', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '24px', display: 'flex', gap: '15px', alignItems: 'start' },
    infoIcon: { backgroundColor: '#fff', padding: '10px', borderRadius: '12px', color: '#10b981', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    infoText: { fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.5' },
    rightPanel: { flex: 1, padding: '60px', overflowY: 'auto' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '60px' },
    searchContainer: { position: 'relative', width: '450px' },
    searchIcon: { position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' },
    searchInput: { width: '100%', padding: '22px 22px 22px 60px', borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', outline: 'none', fontSize: '18px', fontWeight: '700' },
    statusBox: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ecfdf5', padding: '15px 25px', borderRadius: '24px', border: '1px solid #d1fae5' },
    statusLabel: { fontSize: '10px', fontWeight: '900', color: '#10b981', margin: 0, opacity: 0.6 },
    statusValue: { fontSize: '14px', fontWeight: '900', color: '#065f46', margin: 0 },
    statusIcon: { width: '48px', height: '48px', backgroundColor: '#10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '40px' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '48px', boxShadow: '0 15px 40px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden', border: '1px solid #f1f5f9' },
    pulseDot: { position: 'absolute', top: '40px', right: '40px', width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' },
    iconBox: { width: '80px', height: '80px', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1px' },
    cardId: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', margin: '5px 0 0 0', letterSpacing: '1px' },
    areaDisplay: { display: 'flex', alignItems: 'baseline', gap: '8px' },
    areaValue: { fontSize: '48px', fontWeight: '900', fontStyle: 'italic' },
    areaUnit: { fontSize: '18px', fontWeight: '900', color: '#10b981' },
    actionGroup: { display: 'flex', gap: '12px' },
    actionBtn: { width: '55px', height: '55px', borderRadius: '20px', border: 'none', backgroundColor: '#f8fafc', color: '#94a3b8', cursor: 'pointer' },
    dropBtn: { width: '55px', height: '55px', borderRadius: '20px', border: 'none', backgroundColor: '#fff1f2', color: '#f43f5e', cursor: 'pointer' },
    centerBlock: { gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px' },
    spinner: { color: '#10b981', marginBottom: '20px', animation: 'spin 2s linear infinite' },
    loadingText: { fontWeight: '900', color: '#cbd5e1', letterSpacing: '2px', fontSize: '12px' }
};

// Keyframe animation for the spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(styleSheet);

export default AddLand;
