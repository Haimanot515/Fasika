import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const FarmerUpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farm_name: '', farm_type: '', public_farmer_id: '',
    plot_name: '', area_size: '',
    tag_number: '', species: '',
    photo_url: '' // To store the current URL from DB
  });

  const [photoFile, setPhotoFile] = useState(null); // Actual file to upload
  const [preview, setPreview] = useState(''); // UI preview
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  // 1. Fetch data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/farmers/profile'); // Corrected endpoint
        const data = res.data.data; // Adjusted for our response structure { success: true, data: ... }
        
        setFormData({
          farm_name: data.farm_name || '',
          farm_type: data.farm_type || '',
          public_farmer_id: data.public_farmer_id || '',
          plot_name: data.plots?.[0]?.plot_name || '',
          area_size: data.plots?.[0]?.area_size || '',
          tag_number: data.animals?.[0]?.tag_number || '',
          species: data.animals?.[0]?.species || '',
          photo_url: data.photo_url || '' 
        });
        setPreview(data.photo_url || '');
      } catch (err) {
        setStatus({ msg: 'Failed to load profile data', isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Photo Change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); // Store file object for FormData
      setPreview(URL.createObjectURL(file)); // Fast preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus({ msg: '', isError: false });

    const data = new FormData();
    // If a new file was chosen, add it. If not, the backend keeps the old one.
    if (photoFile) {
      data.append('photo', photoFile);
    }

    // Append all other fields
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await api.put('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Profile updated successfully!', isError: false });
    } catch (err) {
      setStatus({ 
        msg: 'Update failed: ' + (err.response?.data?.error || 'Server error'), 
        isError: true 
      });
    } finally {
      setUpdating(false);
    }
  };

  // --- Styles ---
  const s = {
    wrapper: { maxWidth: '850px', margin: '40px auto', padding: '20px', backgroundColor: '#f4f7f6', borderRadius: '15px' },
    card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' },
    header: { color: '#2d6a4f', textAlign: 'center', marginBottom: '30px' },
    section: { marginBottom: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '10px' },
    sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '15px', borderBottom: '2px solid #d8f3dc' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    label: { fontSize: '13px', marginBottom: '5px', fontWeight: '600', color: '#4a5568' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '100%', boxSizing: 'border-box' },
    button: { width: '100%', padding: '16px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    moreBtn: { marginTop: '15px', padding: '8px 15px', backgroundColor: '#e2e8f0', color: '#2d6a4f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    photoPreview: { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2d6a4f', marginBottom: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }
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
          {/* PHOTO SECTION */}
          <div style={s.section}>
            <div style={s.sectionTitle}>Profile Photo</div>
            <div style={{textAlign: 'center'}}>
               {preview && <img src={preview} alt="Profile" style={s.photoPreview} />}
               <input type="file" accept="image/*" onChange={handlePhotoChange} style={{...s.input, border: 'none'}} />
            </div>
          </div>

          {/* FARM DETAILS */}
          <div style={s.section}>
            <div style={s.sectionTitle}>1. Farm Details</div>
            <div style={s.grid}>
              <div><label style={s.label}>Farm Name</label><input style={s.input} name="farm_name" value={formData.farm_name} onChange={handleChange} /></div>
              <div><label style={s.label}>Public Farmer ID</label><input style={s.input} name="public_farmer_id" value={formData.public_farmer_id} onChange={handleChange} /></div>
            </div>
          </div>

          {/* ASSETS SECTION */}
          <div style={s.section}>
            <div style={s.sectionTitle}>2. Land & Assets</div>
            <div style={s.grid}>
              <div><label style={s.label}>Plot Name</label><input style={s.input} name="plot_name" value={formData.plot_name} onChange={handleChange} /></div>
              <div><label style={s.label}>Area (Ha)</label><input style={s.input} type="number" name="area_size" value={formData.area_size} onChange={handleChange} /></div>
              <div><label style={s.label}>Animal Tag</label><input style={s.input} name="tag_number" value={formData.tag_number} onChange={handleChange} /></div>
              <div><label style={s.label}>Species</label><input style={s.input} name="species" value={formData.species} onChange={handleChange} /></div>
            </div>
          </div>

          <button type="submit" disabled={updating} style={{...s.button, opacity: updating ? 0.7 : 1}}>
            {updating ? 'Saving Changes...' : 'Update Farmer Registry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerUpdateProfile;
