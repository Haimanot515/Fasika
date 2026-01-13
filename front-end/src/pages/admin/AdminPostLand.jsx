import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineDatabase } from 'react-icons/hi';

const AdminPostLand = () => {
    const [formData, setFormData] = useState({
        farmer_id: '',
        plot_name: '',
        area_size: '',
        land_status: 'Active',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🔍 Alphabetical Search Logic: Targeted for the "Starts With" registry behavior
    useEffect(() => {
        const fetchFarmers = async () => {
            if (searchTerm.length < 1) { 
                setSuggestions([]); 
                setShowSuggestions(false); 
                return; 
            }
            
            // Don't search if the user already selected the farmer
            if (formData.farmer_id && searchTerm === suggestions.find(f => f.id === formData.farmer_id)?.name) {
                return;
            }

            setIsSearching(true);
            setShowSuggestions(true);
            
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/admin/farmers/search?q=${searchTerm}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuggestions(res.data.farmers || []);
            } catch (err) { 
                console.error("Registry search error", err); 
            } finally { 
                setIsSearching(false); 
            }
        };

        const timer = setTimeout(fetchFarmers, 300); 
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelect = (farmer) => {
        setFormData({ ...formData, farmer_id: farmer.id });
        setSearchTerm(farmer.name);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/farmers/land/post', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setMessage({ type: 'success', text: '✅ SUCCESS: Record successfully DROPPED into the registry.' });
            
            // Reset form
            setFormData({ farmer_id: '', plot_name: '', area_size: '', land_status: 'Active' });
            setSearchTerm('');
        } catch (err) {
            setMessage({ type: 'error', text: '❌ REGISTRY ERROR: System failed to drop record. Verify database connection.' });
        } finally { 
            setIsSubmitting(false); 
        }
    };

    // UI Styles
    const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: '#fcfcfc' };
    const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' };

    return (
        <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ background: '#064e3b', padding: '25px', color: 'white' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <HiOutlineDatabase /> Land Registry Entry
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
                        {message.text && (
                            <div style={{ padding: '15px', marginBottom: '20px', borderRadius: '8px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border: '1px solid currentColor', fontSize: '13px' }}>
                                {message.text}
                            </div>
                        )}

                        {/* SEARCH SECTION */}
                        <div style={{ marginBottom: '30px', position: 'relative' }} ref={dropdownRef}>
                            <label style={labelStyle}>Alphabetical Farmer Search</label>
                            <div style={{ position: 'relative' }}>
                                <HiOutlineSearch style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                                <input 
                                    type="text" 
                                    placeholder="Type 'H' for Haimanot..." 
                                    value={searchTerm} 
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        if (formData.farmer_id) setFormData({...formData, farmer_id: ''}); // Clear ID if user changes text
                                    }} 
                                    style={{ ...inputStyle, paddingLeft: '40px', border: formData.farmer_id ? '2px solid #10b981' : '1px solid #e2e8f0' }} 
                                />
                            </div>
                            
                            {showSuggestions && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 100, boxShadow: '0 10px 15px rgba(0,0,0,0.1)', marginTop: '4px', maxHeight: '250px', overflowY: 'auto' }}>
                                    {isSearching ? (
                                        <div style={{ padding: '15px', textAlign: 'center', color: '#64748b' }}>Searching Registry...</div>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map(f => (
                                            <div key={f.id} onClick={() => handleSelect(f)} style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }} onMouseEnter={(e) => e.target.style.background = '#f8fafc'} onMouseLeave={(e) => e.target.style.background = 'white'}>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{f.name}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {f.id} • {f.phone || 'No Phone'}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
                                            <div style={{ fontWeight: '700' }}>No Records Found</div>
                                            <small>No farmer name starts with "{searchTerm}"</small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* LAND FIELDS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                            <div>
                                <label style={labelStyle}>Plot Name</label>
                                <input type="text" required placeholder="Ex: North Field" value={formData.plot_name} onChange={(e) => setFormData({...formData, plot_name: e.target.value})} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Total Hectares</label>
                                <input type="number" step="0.01" required placeholder="0.00" value={formData.area_size} onChange={(e) => setFormData({...formData, area_size: e.target.value})} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Current Registry Status</label>
                            <select value={formData.land_status} onChange={(e) => setFormData({...formData, land_status: e.target.value})} style={inputStyle}>
                                <option value="Active">Active / Arable</option>
                                <option value="Pending">Pending Review</option>
                                <option value="Fallow">Fallow / Resting</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting || !formData.farmer_id} 
                            style={{ 
                                width: '100%', padding: '15px', 
                                background: !formData.farmer_id ? '#cbd5e0' : '#059669', 
                                color: 'white', border: 'none', borderRadius: '8px', 
                                fontWeight: '700', cursor: !formData.farmer_id ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isSubmitting ? "PROCESSING REGISTRY DROP..." : "FINALIZE LAND REGISTRATION"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPostLand;