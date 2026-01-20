import React, { useState, useEffect, useRef } from 'react';
// 🟢 Using centralized axios instance
import api from "../../api/axios"; 
import { HiOutlineSearch, HiOutlineDatabase, HiOutlineMap, HiOutlineBeaker } from 'react-icons/hi';

const AdminPostLand = () => {
    const [formData, setFormData] = useState({
        farmer_id: '',
        plot_name: '',
        area_size: '',
        // --- Added all Authority Properties ---
        soil_type: 'Nitosols',
        climate_zone: 'Weyna Dega',
        region: '',
        zone: '',
        woreda: '',
        kebele: '',
        land_status: 'Active',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchFarmers = async () => {
            if (searchTerm.length < 1) { 
                setSuggestions([]); 
                setShowSuggestions(false); 
                return; 
            }
            if (formData.farmer_id && searchTerm === suggestions.find(f => f.id === formData.farmer_id)?.name) return;

            setIsSearching(true);
            setShowSuggestions(true);
            try {
                const res = await api.get(`/admin/farmers/search?q=${searchTerm}`);
                setSuggestions(res.data.farmers || []);
            } catch (err) { console.error("Search error", err); } 
            finally { setIsSearching(false); }
        };
        const timer = setTimeout(fetchFarmers, 300); 
        return () => clearTimeout(timer);
    }, [searchTerm, formData.farmer_id]);

    const handleSelect = (farmer) => {
        setFormData({ ...formData, farmer_id: farmer.id });
        setSearchTerm(farmer.name);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // 🟢 Executing DROP with all properties
            await api.post('/admin/farmers/land/post', formData);
            setMessage({ type: 'success', text: '✅ SUCCESS: Complete record DROPPED into the registry.' });
            setFormData({ 
                farmer_id: '', plot_name: '', area_size: '', region: '', zone: '', 
                woreda: '', kebele: '', soil_type: 'Nitosols', climate_zone: 'Weyna Dega', land_status: 'Active' 
            });
            setSearchTerm('');
        } catch (err) {
            setMessage({ type: 'error', text: '❌ DROP FAILED: Check authority permissions.' });
        } finally { setIsSubmitting(false); }
    };

    const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#fff' };
    const labelStyle = { display: 'block', fontSize: '10px', fontWeight: '800', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px 15px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                
                <div style={{ background: '#064e3b', padding: '20px', borderRadius: '12px 12px 0 0', color: 'white' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HiOutlineDatabase size={20}/> Admin Authority: Land Registry DROP
                    </h4>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
                    {message.text && (
                        <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', fontSize: '12px', fontWeight: '600' }}>
                            {message.text}
                        </div>
                    )}

                    {/* IDENTITY SEARCH */}
                    <div style={{ marginBottom: '25px', position: 'relative' }} ref={dropdownRef}>
                        <label style={labelStyle}>Assign to Farmer Identity</label>
                        <div style={{ position: 'relative' }}>
                            <HiOutlineSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                            <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); if (formData.farmer_id) setFormData({...formData, farmer_id: ''}); }} style={{ ...inputStyle, paddingLeft: '35px' }} />
                        </div>
                        {showSuggestions && (
                            <div style={{ position: 'absolute', width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '5px' }}>
                                {isSearching ? <div style={{ padding: '10px', textAlign: 'center', fontSize: '12px' }}>Searching...</div> : 
                                suggestions.map(f => (
                                    <div key={f.id} onClick={() => handleSelect(f)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{f.name}</div>
                                        <div style={{ fontSize: '10px', color: '#64748b' }}>UID: {f.id}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* PHYSICAL SPECS */}
                        <section>
                            <h5 style={{ fontSize: '11px', color: '#064e3b', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>Physical Specifications</h5>
                            <div style={{ marginTop: '15px' }}>
                                <label style={labelStyle}>Plot Name</label>
                                <input type="text" required value={formData.plot_name} onChange={(e) => setFormData({...formData, plot_name: e.target.value})} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '15px' }}>
                                <label style={labelStyle}>Area (Hectares)</label>
                                <input type="number" step="0.01" required value={formData.area_size} onChange={(e) => setFormData({...formData, area_size: e.target.value})} style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Soil Type</label>
                                    <select value={formData.soil_type} onChange={(e) => setFormData({...formData, soil_type: e.target.value})} style={inputStyle}>
                                        <option value="Nitosols">Nitosols</option>
                                        <option value="Vertisols">Vertisols</option>
                                        <option value="Cambisols">Cambisols</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Climate</label>
                                    <select value={formData.climate_zone} onChange={(e) => setFormData({...formData, climate_zone: e.target.value})} style={inputStyle}>
                                        <option value="Dega">Dega</option>
                                        <option value="Weyna Dega">Weyna Dega</option>
                                        <option value="Kolla">Kolla</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* GEOGRAPHIC LOCATION */}
                        <section>
                            <h5 style={{ fontSize: '11px', color: '#064e3b', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>Geographic metadata</h5>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Region</label>
                                    <input type="text" required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Zone</label>
                                    <input type="text" required value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Woreda</label>
                                    <input type="text" required value={formData.woreda} onChange={(e) => setFormData({...formData, woreda: e.target.value})} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Kebele</label>
                                    <input type="text" required value={formData.kebele} onChange={(e) => setFormData({...formData, kebele: e.target.value})} style={inputStyle} />
                                </div>
                            </div>
                        </section>
                    </div>

                    <button type="submit" disabled={isSubmitting || !formData.farmer_id} style={{ width: '100%', marginTop: '30px', padding: '12px', background: formData.farmer_id ? '#059669' : '#cbd5e0', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
                        {isSubmitting ? "PROCESSING DROP..." : "EXECUTE AUTHORITY DROP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPostLand;
