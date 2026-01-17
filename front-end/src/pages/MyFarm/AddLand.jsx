import React, { useState, useEffect } from 'react';
import api from "../../api/axios"; 
import { 
  Plus, Trash2, Map, Activity, Search, 
  MapPin, Loader2, Wheat, TreePine, 
  Layers, CloudSun, Cow, X, Sprout, 
  Navigation, Trash
} from 'lucide-react';

const AddLand = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({ temp: '24', condition: 'Scanning...' });
    const [searchTerm, setSearchTerm] = useState("");
    
    const [formData, setFormData] = useState({ 
        plot_name: '', 
        area_size: '', 
        land_status: 'Active',
        crops: [], 
        animals: [] 
    });

    const [tempCrop, setTempCrop] = useState("");
    const [tempAnimal, setTempAnimal] = useState("");

    const LAND_PATH = '/farmer/farm/land';

    useEffect(() => {
        setTimeout(() => setWeather({ temp: '28', condition: 'Optimal' }), 2000);
        fetchLands();
    }, []);

    const fetchLands = async () => {
        setLoading(true);
        try {
            const res = await api.get(LAND_PATH);
            setLands(res.data.data || []);
        } catch (err) {
            console.error("Registry Sync Failed");
        } finally {
            setLoading(false);
        }
    };

    const addCropToForm = () => {
        if (tempCrop) {
            setFormData({ ...formData, crops: [...formData.crops, tempCrop] });
            setTempCrop("");
        }
    };

    const addAnimalToForm = () => {
        if (tempAnimal) {
            setFormData({ ...formData, animals: [...formData.animals, tempAnimal] });
            setTempAnimal("");
        }
    };

    const handleAddLand = async (e) => {
        e.preventDefault();
        try {
            await api.post(LAND_PATH, formData);
            alert("Success! Asset & Biology DROPPED into the registry.");
            setFormData({ plot_name: '', area_size: '', land_status: 'Active', crops: [], animals: [] });
            fetchLands();
        } catch (err) {
            alert(err.response?.data?.message || "Registry entry failed.");
        }
    };

    const handleDropLand = async (id) => {
        if (window.confirm("Are you sure you want to DROP this asset from the registry?")) {
            try {
                await api.delete(`${LAND_PATH}/${id}`);
                fetchLands();
            } catch (err) { alert("DROP failed."); }
        }
    };

    return (
        <div style={styles.container}>
            {/* LEFT PANEL: SMART REGISTRATION */}
            <div style={styles.leftPanel}>
                <div style={styles.brandSection}>
                    <div style={styles.badge}><Sprout size={16} /> ECO-SYSTEM SYNC</div>
                    <h1 style={styles.mainTitle}>ASSET <br /><span style={styles.italicTitle}>DROP</span></h1>
                    <p style={styles.subtitle}>Register your plot into the secure farm registry.</p>
                </div>

                <form onSubmit={handleAddLand} style={styles.form}>
                    <div style={styles.inputWrapper}>
                        <label style={styles.label}>Plot Identity</label>
                        <div style={styles.inputBox}>
                            <MapPin style={styles.inputIcon} size={18} />
                            <input 
                                style={styles.input} 
                                value={formData.plot_name}
                                onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                                placeholder="Plot name (e.g. North Field)" required 
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={{flex: 1.5}}>
                            <label style={styles.label}>Area Size (Ha)</label>
                            <input 
                                style={styles.input} 
                                type="number" 
                                value={formData.area_size}
                                onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                                placeholder="0.00" required 
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={styles.label}>GPS Sync</label>
                            <div style={styles.gpsStatus}>
                                <Navigation size={14} /> LIVE
                            </div>
                        </div>
                    </div>

                    {/* UNLIMITED CROP TAGS */}
                    <div style={styles.sectionDivider}>
                        <label style={styles.label}>Biology: Crops</label>
                        <div style={styles.tagInputRow}>
                            <input 
                                style={styles.tagInput} 
                                value={tempCrop}
                                onChange={(e) => setTempCrop(e.target.value)}
                                placeholder="Add crop..."
                            />
                            <button type="button" onClick={addCropToForm} style={styles.addTagBtn}><Plus size={18}/></button>
                        </div>
                        <div style={styles.tagCloud}>
                            {formData.crops.map((c, i) => (
                                <span key={i} style={styles.tag}><Wheat size={12}/> {c}</span>
                            ))}
                        </div>
                    </div>

                    {/* UNLIMITED ANIMAL TAGS */}
                    <div style={styles.sectionDivider}>
                        <label style={styles.label}>Biology: Livestock</label>
                        <div style={styles.tagInputRow}>
                            <input 
                                style={styles.tagInput} 
                                value={tempAnimal}
                                onChange={(e) => setTempAnimal(e.target.value)}
                                placeholder="Add animal..."
                            />
                            <button type="button" onClick={addAnimalToForm} style={styles.addTagBtn}><Plus size={18}/></button>
                        </div>
                        <div style={styles.tagCloud}>
                            {formData.animals.map((a, i) => (
                                <span key={i} style={{...styles.tag, background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd'}}><Cow size={12}/> {a}</span>
                            ))}
                        </div>
                    </div>

                    <button type="submit" style={styles.submitBtn}>
                        <Activity size={20} /> DROP INTO REGISTRY
                    </button>
                </form>
            </div>

            {/* RIGHT PANEL: EXPLORER */}
            <div style={styles.rightPanel}>
                <div style={styles.headerRow}>
                    <div style={styles.searchSection}>
                        <h2 style={styles.sectionLabel}>Registry Explorer</h2>
                        <div style={styles.searchContainer}>
                            <Search style={styles.searchIcon} size={20} />
                            <input 
                                style={styles.searchInput}
                                placeholder="Filter active assets..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div style={styles.weatherBox}>
                        <div style={styles.weatherIcon}><CloudSun size={24} /></div>
                        <div>
                            <p style={styles.statusLabel}>Environment</p>
                            <p style={styles.statusValue}>{weather.temp}°C • {weather.condition}</p>
                        </div>
                    </div>
                </div>

                <div style={styles.grid}>
                    {loading ? (
                        <div style={styles.centerBlock}><Loader2 style={styles.spinner} size={48} /></div>
                    ) : lands.filter(l => l.plot_name.toLowerCase().includes(searchTerm.toLowerCase())).map((plot) => (
                        <div key={plot.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={styles.iconBox}><TreePine size={28} /></div>
                                <div>
                                    <h3 style={styles.cardTitle}>{plot.plot_name}</h3>
                                    <span style={styles.areaBadge}>{plot.area_size} Hectares Managed</span>
                                </div>
                            </div>
                            
                            <div style={styles.cardContent}>
                                <div style={styles.assetGroup}>
                                    <div style={styles.miniTags}>
                                        <div style={styles.statBox}>
                                            <span style={styles.statVal}>{plot.crop_count || 0}</span>
                                            <span style={styles.statLab}>Crops</span>
                                        </div>
                                        <div style={styles.statBox}>
                                            <span style={styles.statVal}>{plot.animal_count || 0}</span>
                                            <span style={styles.statLab}>Animals</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => handleDropLand(plot.id)} style={styles.dropBtn}>
                                <Trash size={16} /> DROP FROM REGISTRY
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f0', fontFamily: '"Inter", sans-serif', color: '#1a2e1a' },
    leftPanel: { width: '400px', backgroundColor: '#ffffff', borderRight: '1px solid #d1dbd1', padding: '40px', display: 'flex', flexDirection: 'column', boxShadow: '10px 0 30px rgba(0,0,0,0.02)', zIndex: 10 },
    brandSection: { marginBottom: '35px' },
    badge: { display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px', marginBottom: '12px' },
    mainTitle: { fontSize: '48px', fontWeight: '900', color: '#064e3b', lineHeight: '0.9', margin: 0 },
    italicTitle: { color: '#10b981', fontStyle: 'italic', fontWeight: '400' },
    subtitle: { color: '#6b7280', fontSize: '14px', marginTop: '10px' },
    form: { display: 'flex', flexDirection: 'column', gap: '24px' },
    label: { fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', marginBottom: '8px', display: 'block' },
    inputBox: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '15px', color: '#059669' },
    input: { width: '100%', padding: '14px 15px 14px 45px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: '600', fontSize: '15px', outlineColor: '#10b981' },
    row: { display: 'flex', gap: '15px', alignItems: 'flex-end' },
    gpsStatus: { padding: '14px', background: '#ecfdf5', color: '#059669', borderRadius: '12px', fontSize: '13px', fontWeight: '800', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', border: '1px solid #d1fae5' },
    sectionDivider: { borderTop: '1px solid #f3f4f6', paddingTop: '10px' },
    tagInputRow: { display: 'flex', gap: '8px' },
    tagInput: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#fff' },
    addTagBtn: { width: '45px', borderRadius: '10px', border: 'none', backgroundColor: '#064e3b', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    tagCloud: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' },
    tag: { padding: '6px 12px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: '4px' },
    submitBtn: { padding: '18px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' },
    rightPanel: { flex: 1, padding: '40px 60px', overflowY: 'auto' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    sectionLabel: { fontSize: '24px', fontWeight: '800', color: '#064e3b', margin: '0 0 15px 0' },
    searchContainer: { position: 'relative', width: '400px' },
    searchIcon: { position: 'absolute', left: '18px', top: '15px', color: '#9ca3af' },
    searchInput: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', fontWeight: '500', outlineColor: '#10b981' },
    weatherBox: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fff', padding: '12px 25px', borderRadius: '18px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
    weatherIcon: { color: '#f59e0b' },
    statusLabel: { margin: 0, fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase' },
    statusValue: { margin: 0, fontSize: '15px', fontWeight: '700', color: '#1f2937' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    card: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', transition: 'transform 0.2s' },
    cardHeader: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' },
    iconBox: { width: '56px', height: '56px', backgroundColor: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' },
    cardTitle: { fontSize: '20px', fontWeight: '800', margin: 0, color: '#111827' },
    areaBadge: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
    miniTags: { display: 'flex', gap: '12px' },
    statBox: { flex: 1, padding: '12px', background: '#f9fafb', borderRadius: '12px', textAlign: 'center' },
    statVal: { display: 'block', fontSize: '18px', fontWeight: '800', color: '#059669' },
    statLab: { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' },
    dropBtn: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #fee2e2', backgroundColor: '#fff', color: '#ef4444', fontWeight: '700', cursor: 'pointer', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' },
    centerBlock: { gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '50px' },
    spinner: { animation: 'spin 2s linear infinite', color: '#059669' }
};

export default AddLand;
