import React, { useState, useEffect } from 'react';
import api from "../../api/axios"; 
import { 
  Plus, X, Save, Map, MapPin, Maximize, 
  Activity, Wheat, Info, Loader2, Thermometer
} from 'lucide-react';

const UpdateLand = ({ plotId, onUpdateSuccess, onCancel }) => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        plot_name: '',
        area_size: '',
        land_status: 'Active',
        crops: [],
        animals: []
    });

    const LAND_PATH = `/farmer/farm/land/${plotId}`;

    useEffect(() => {
        const fetchCurrentPlot = async () => {
            try {
                // Fetch specific plot from the registry
                const res = await api.get('/farmer/farm/land');
                const plot = res.data.data.find(p => p.id === parseInt(plotId));
                if (plot) {
                    setFormData({
                        plot_name: plot.plot_name,
                        area_size: plot.area_size,
                        land_status: plot.land_status || 'Active',
                        crops: plot.crops || [], // Assuming backend returns associated data
                        animals: plot.animals || []
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("Registry Sync Failed", err);
                setLoading(false);
            }
        };
        fetchCurrentPlot();
    }, [plotId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(LAND_PATH, formData);
            alert("Success! Registry node updated.");
            onUpdateSuccess();
        } catch (err) {
            alert("DROP update failed. Check node connection.");
        }
    };

    if (loading) return (
        <div style={styles.centerBlock}>
            <Loader2 style={styles.spinner} size={40} />
            <p style={styles.loadingText}>Loading Node #{plotId}...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* Header: Smart OS Style */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.iconBox}><Map size={24} /></div>
                    <div>
                        <h2 style={styles.title}>UPDATE ASSET</h2>
                        <p style={styles.subtitle}>Registry ID: 0x{plotId?.toString().padStart(4, '0')}</p>
                    </div>
                </div>
                <button onClick={onCancel} style={styles.closeBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdate} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Identity Name</label>
                    <div style={styles.inputWrapper}>
                        <MapPin style={styles.innerIcon} size={18} />
                        <input 
                            style={styles.input}
                            value={formData.plot_name}
                            onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={{flex: 1}}>
                        <label style={styles.label}>Calculated Area (Ha)</label>
                        <div style={styles.inputWrapper}>
                            <Maximize style={styles.innerIcon} size={18} />
                            <input 
                                style={styles.input}
                                type="number" step="0.01"
                                value={formData.area_size}
                                onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <label style={styles.label}>Node Status</label>
                        <select 
                            style={styles.select}
                            value={formData.land_status}
                            onChange={(e) => setFormData({...formData, land_status: e.target.value})}
                        >
                            <option value="Active">Active Production</option>
                            <option value="Fallow">Fallow (Resting)</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>

                <div style={styles.infoBox}>
                    <Info size={16} color="#10b981" />
                    <p style={styles.infoText}>Modifying this asset will update all linked biological data across the node.</p>
                </div>

                <div style={styles.footer}>
                    <button type="submit" style={styles.saveBtn}>
                        <Save size={18} /> SAVE CHANGES
                    </button>
                    <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                        CANCEL
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' },
    header: { padding: '30px', backgroundColor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
    iconBox: { padding: '12px', backgroundColor: '#10b981', borderRadius: '14px', color: '#fff' },
    title: { margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' },
    subtitle: { margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '1px' },
    closeBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
    form: { padding: '40px', display: 'flex', flexDirection: 'column', gap: '25px' },
    label: { fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' },
    inputWrapper: { position: 'relative' },
    innerIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' },
    input: { width: '100%', padding: '15px 15px 15px 45px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '15px', fontWeight: '700', boxSizing: 'border-box' },
    select: { width: '100%', padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '15px', fontWeight: '700', cursor: 'pointer' },
    row: { display: 'flex', gap: '20px' },
    infoBox: { display: 'flex', gap: '12px', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '15px' },
    infoText: { fontSize: '12px', color: '#166534', margin: 0, fontWeight: '500' },
    footer: { display: 'flex', gap: '15px', marginTop: '10px' },
    saveBtn: { flex: 2, padding: '18px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
    cancelBtn: { flex: 1, padding: '18px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '18px', fontWeight: '800', cursor: 'pointer' },
    centerBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px' },
    spinner: { color: '#10b981', animation: 'spin 2s linear infinite', marginBottom: '15px' },
    loadingText: { fontSize: '12px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }
};

export default UpdateLand;
