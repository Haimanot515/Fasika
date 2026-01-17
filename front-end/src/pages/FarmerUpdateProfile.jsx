import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const FarmerUpdateProfile = () => {
  const [formData, setFormData] = useState({
    farm_name: '', farm_type: '', public_farmer_id: '',
    plot_name: '', area_size: '',
    crop_name: '', planting_date: '',
    tag_number: '', species: ''
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  // 1. Fetch existing data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/farmers/my-profile');
        // Pre-fill form with existing data from the split tables
        setFormData({
          farm_name: res.data.farm_name || '',
          farm_type: res.data.farm_type || '',
          public_farmer_id: res.data.public_farmer_id || '',
          plot_name: res.data.plots?.[0]?.plot_name || '',
          area_size: res.data.plots?.[0]?.area_size || '',
          crop_name: res.data.crops?.[0]?.crop_name || '',
          planting_date: res.data.crops?.[0]?.planting_date?.split('T')[0] || '',
          tag_number: res.data.animals?.[0]?.tag_number || '',
          species: res.data.animals?.[0]?.species || ''
        });
      } catch (err) {
        setStatus({ msg: 'Failed to load profile data', isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Sends data back to be distributed into correct tables
      await api.put('/farmers/update-profile', formData);
      setStatus({ msg: 'Profile updated successfully!', isError: false });
    } catch (err) {
      setStatus({ msg: 'Update failed: ' + (err.response?.data?.message || 'Server error'), isError: true });
    } finally {
      setUpdating(false);
    }
  };

  // --- Inline Styles (Matching your Registration Form) ---
  const s = {
    wrapper: { maxWidth: '850px', margin: '40px auto', padding: '20px', backgroundColor: '#f4f7f6', borderRadius: '15px' },
    card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' },
    header: { color: '#2d6a4f', textAlign: 'center', marginBottom: '30px' },
    section: { marginBottom: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '10px' },
    sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '15px', borderBottom: '2px solid #d8f3dc' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    label: { fontSize: '13px', marginBottom: '5px', fontWeight: '600', color: '#4a5568' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '100%', boxSizing: 'border-box' },
    button: { width: '100%', padding: '16px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Registry Data...</div>;

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h1 style={s.header}>Update Farmer Profile</h1>
        
        {status.msg && (
          <div style={{ padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: status.isError ? '#fff5f5' : '#f0fff4', color: status.isError ? '#c53030' : '#276749', border: '1px solid' }}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* SECTION 1: FARM REGISTRY */}
          <div style={s.section}>
            <div style={s.sectionTitle}>1. Farm Details (Farmers Table)</div>
            <div style={s.grid}>
              <div>
                <label style={s.label}>Farm Name</label>
                <input style={s.input} name="farm_name" value={formData.farm_name} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Public Farmer ID</label>
                <input style={s.input} name="public_farmer_id" value={formData.public_farmer_id} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION 2: LAND & CROPS */}
          <div style={s.section}>
            <div style={s.sectionTitle}>2. Land Plot & Primary Crop</div>
            <div style={s.grid}>
              <div>
                <label style={s.label}>Plot Name</label>
                <input style={s.input} name="plot_name" value={formData.plot_name} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Area Size (Ha)</label>
                <input style={s.input} type="number" name="area_size" value={formData.area_size} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Crop Name</label>
                <input style={s.input} name="crop_name" value={formData.crop_name} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Planting Date</label>
                <input style={s.input} type="date" name="planting_date" value={formData.planting_date} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION 3: LIVESTOCK */}
          <div style={s.section}>
            <div style={s.sectionTitle}>3. Livestock (Animals Table)</div>
            <div style={s.grid}>
              <div>
                <label style={s.label}>Animal Tag Number</label>
                <input style={s.input} name="tag_number" value={formData.tag_number} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Species</label>
                <input style={s.input} name="species" value={formData.species} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={updating} style={s.button}>
            {updating ? 'Updating Registry...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerUpdateProfile;
