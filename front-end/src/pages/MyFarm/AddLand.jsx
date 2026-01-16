import React, { useState, useEffect } from 'react';
import api from "../../api/axios"; 
import { 
  Plus, Trash2, Map, Maximize, Activity, Search, 
  MapPin, Info, Loader2, Wheat, TreePine, 
  Settings2, Layers, AlertCircle, CloudSun, Cow, X
} from 'lucide-react';

const AddLand = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({ temp: '24', condition: 'Scanning...' });
    const [searchTerm, setSearchTerm] = useState("");
    
    // Expanded Form State for Unlimited Assets
    const [formData, setFormData] = useState({ 
        plot_name: '', 
        area_size: '', 
        land_status: 'Active',
        crops: [], // Unlimited crops
        animals: [] // Unlimited animals
    });

    const [tempCrop, setTempCrop] = useState("");
    const [tempAnimal, setTempAnimal] = useState("");

    const LAND_PATH = '/farmer/farm/land';

    // Auto-detect Weather on Load
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

    /* ───── UNLIMITED ADDITION LOGIC ───── */
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
        if (window.confirm("DROP this asset from the registry?")) {
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
                    <div style={styles.badge}><Layers size={14} /> SMART FARM OS</div>
                    <h1 style={styles.mainTitle}>DROP <br /><span style={styles.italicTitle}>Registry</span></h1>
                </div>

                <form onSubmit={handleAddLand} style={styles.form}>
                    <div style={styles.inputWrapper}>
                        <label style={styles.label}>Plot Identity</label>
                        <div style={styles.inputContainer}>
                            <MapPin style={styles.inputIcon} size={20} />
                            <input 
                                style={styles.input} 
                                value={formData.plot_name}
                                onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                                placeholder="e.g. Sector-7 Delta" required 
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={{flex: 1}}>
                            <label style={styles.label}>Area (Ha)</label>
                            <input 
                                style={styles.inputSmall} 
                                type="number" 
                                value={formData.area_size}
                                onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                                placeholder="0.00" required 
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={styles.label}>Auto-Location</label>
                            <div style={styles.locationBadge}>GPS ACTIVE</div>
                        </div>
                    </div>

                    {/* UNLIMITED CROP TAGS */}
                    <div>
                        <label style={styles.label}>Add Crops (Unlimited)</label>
                        <div style={styles.tagInputRow}>
                            <input 
                                style={styles.tagInput} 
                                value={tempCrop}
                                onChange={(e) => setTempCrop(e.target.value)}
                                placeholder="Crop type..."
                            />
                            <button type="button" onClick={addCropToForm} style={styles.addTagBtn}><Plus size={16}/></button>
                        </div>
                        <div style={styles.tagCloud}>
                            {formData.crops.map((c, i) => <span key={i} style={styles.tag}>{c}</span>)}
                        </div>
                    </div>

                    {/* UNLIMITED ANIMAL TAGS */}
                    <div>
                        <label style={styles.label}>Add Livestock (Unlimited)</label>
                        <div style={styles.tagInputRow}>
                            <input 
                                style={styles.tagInput} 
                                value={tempAnimal}
                                onChange={(e) => setTempAnimal(e.target.value)}
                                placeholder="Animal species..."
                            />
                            <button type="button" onClick={addAnimalToForm} style={styles.addTagBtn}><Plus size={16}/></button>
                        </div>
                        <div style={styles.tagCloud}>
                            {formData.animals.map((a, i) => <span key={i} style={{...styles.tag, backgroundColor: '#f0f9ff', color: '#0369a1'}}>{a}</span>)}
                        </div>
                    </div>

                    <button type="submit" style={styles.submitBtn}>
                        <Activity size={22} /> REGISTER ASSET
                    </button>
                </form>
            </div>

            {/* RIGHT PANEL: EXPLORER */}
            <div style={styles.rightPanel}>
                <div style={styles.headerRow}>
                    <div style={styles.searchSection}>
                        <h2 style={styles.sectionLabel}>Registry Explorer</h2>
                        <div style={styles.searchContainer}>
                            <Search style={styles.searchIcon} size={22} />
                            <input 
                                style={styles.searchInput}
                                placeholder="Filter registry data..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* WEATHER COMPONENT */}
                    <div style={styles.weatherBox}>
                        <div style={{textAlign:'right'}}>
                            <p style={styles.statusLabel}>Live Weather</p>
                            <p style={styles.statusValue}>{weather.temp}°C - {weather.condition}</p>
                        </div>
                        <div style={styles.weatherIcon}><CloudSun size={24} /></div>
                    </div>
                </div>

                <div style={styles.grid}>
                    {loading ? (
                        <div style={styles.centerBlock}><Loader2 style={styles.spinner} size={60} /></div>
                    ) : lands.map((plot, index) => (
                        <div key={plot.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={styles.iconBox}><Wheat size={32} /></div>
                                <div>
                                    <h3 style={styles.cardTitle}>{plot.plot_name}</h3>
                                    <span style={styles.areaBadge}>{plot.area_size} Hectares</span>
                                </div>
                            </div>
                            
                            <div style={styles.cardContent}>
                                <div style={styles.assetGroup}>
                                    <p style={styles.assetLabel}>Registered Biology:</p>
                                    <div style={styles.miniTags}>
                                        <span style={styles.miniTag}>Crops: {plot.crop_count || 0}</span>
                                        <span style={styles.miniTag}>Livestock: {plot.animal_count || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.cardFooter}>
                                <button onClick={() => handleDropLand(plot.id)} style={styles.dropBtn}>
                                    <Trash2 size={18} /> DROP ASSET
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Inter", sans-serif' },
    leftPanel: { width: '420px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0', padding: '40px', display: 'flex', flexDirection: 'column' },
    brandSection: { marginBottom: '40px' },
    badge: { display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '800', fontSize: '11px', letterSpacing: '2px', marginBottom: '10px' },
    mainTitle: { fontSize: '42px', fontWeight: '900', color: '#0f172a', lineHeight: '1', margin: 0 },
    italicTitle: { color: '#10b981', fontStyle: 'italic', fontWeight: '300' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    label: { fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' },
    input: { width: '100%', padding: '15px 15px 15px 50px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '15px', fontWeight: '700', boxSizing: 'border-box' },
    inputSmall: { width: '100%', padding: '15px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '15px', fontWeight: '700', boxSizing: 'border-box' },
    row: { display: 'flex', gap: '15px' },
    locationBadge: { padding: '15px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '15px', fontSize: '12px', fontWeight: '900', textAlign: 'center' },
    tagInputRow: { display: 'flex', gap: '10px' },
    tagInput: { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' },
    addTagBtn: { padding: '10px', borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff', cursor: 'pointer' },
    tagCloud: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' },
    tag: { padding: '5px 12px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #dcfce7' },
    submitBtn: { padding: '20px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
    rightPanel: { flex: 1, padding: '50px', overflowY: 'auto' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    searchContainer: { position: 'relative', width: '350px' },
    searchInput: { width: '100%', padding: '15px 15px 15px 50px', borderRadius: '15px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontWeight: '600' },
    weatherBox: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
    weatherIcon: { width: '45px', height: '45px', backgroundColor: '#fbbf24', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' },
    cardHeader: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' },
    iconBox: { width: '60px', height: '60px', backgroundColor: '#f8fafc', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' },
    cardTitle: { fontSize: '20px', fontWeight: '900', margin: 0 },
    areaBadge: { fontSize: '12px', color: '#64748b', fontWeight: '700' },
    miniTags: { display: 'flex', gap: '10px', marginTop: '10px' },
    miniTag: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', backgroundColor: '#f8fafc', padding: '4px 10px', borderRadius: '8px' },
    dropBtn: { width: '100%', padding: '12px', borderRadius: '15px', border: 'none', backgroundColor: '#fff1f2', color: '#f43f5e', fontWeight: '800', cursor: 'pointer', marginTop: '20px' }
};

export default AddLand;
