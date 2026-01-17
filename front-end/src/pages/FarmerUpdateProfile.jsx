import React, { useState, useEffect } from 'react'; 
import api from '../api/axios';

const FarmerUpdateProfile = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    region: '',
    zone: '',
    woreda: '',
    kebele: '',
    farm_name: '',
    farm_type: '',
    plot_name: '',
    area_size: '',
    tag_number: '',
    species: '',
    photo_url: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  // 1. GET: Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/farmers/profile');
        const d = res.data.data;
        
        // Map nested arrays from your backend SQL (json_agg)
        setFormData({
          full_name: d.full_name || '',
          region: d.region || '',
          zone: d.zone || '',
          woreda: d.woreda || '',
          kebele: d.kebele || '',
          farm_name: d.farm_name || '',
          farm_type: d.farm_type || '',
          plot_name: d.plots?.[0]?.plot_name || '',
          area_size: d.plots?.[0]?.area_size || '',
          tag_number: d.animals?.[0]?.tag_number || '',
          species: d.animals?.[0]?.species || '',
          photo_url: d.photo_url || ''
        });
        setPreview(d.photo_url || '');
      } catch (err) {
        setStatus({ msg: 'Failed to load profile data', isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 2. PUT: Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const data = new FormData();
    
    if (photoFile) data.append('photo', photoFile);

    // Append all fields exactly as they appear in your UPDATE controller destructuring
    const fields = [
      'full_name', 'region', 'zone', 'woreda', 'kebele', 
      'farm_name', 'farm_type', 'plot_name', 'area_size', 
      'tag_number', 'species', 'photo_url'
    ];

    fields.forEach(field => {
        data.append(field, formData[field]);
    });

    try {
      await api.put('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Farmer Profile Updated Successfully!', isError: false });
    } catch (err) {
      setStatus({ msg: 'Update Failed: ' + (err.response?.data?.error || 'Server error'), isError: true });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Registry Data...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: '#f4f7f6', borderRadius: '15px' }}>
      <h1 style={{ textAlign: 'center', color: '#2d6a4f' }}>Update Profile</h1>
      {status.msg && <div style={{ padding: '10px', textAlign: 'center', color: status.isError ? 'red' : 'green' }}>{status.msg}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
           {preview && <img src={preview} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2d6a4f' }} />}
           <input type="file" onChange={handlePhotoChange} style={{ display: 'block', margin: '10px auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input style={{ padding: '10px' }} name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" />
          <input style={{ padding: '10px' }} name="farm_name" value={formData.farm_name} onChange={handleChange} placeholder="Farm Name" />
          <input style={{ padding: '10px' }} name="region" value={formData.region} onChange={handleChange} placeholder="Region" />
          <input style={{ padding: '10px' }} name="zone" value={formData.zone} onChange={handleChange} placeholder="Zone" />
          <input style={{ padding: '10px' }} name="woreda" value={formData.woreda} onChange={handleChange} placeholder="Woreda" />
          <input style={{ padding: '10px' }} name="kebele" value={formData.kebele} onChange={handleChange} placeholder="Kebele" />
          <input style={{ padding: '10px' }} name="plot_name" value={formData.plot_name} onChange={handleChange} placeholder="Plot Name" />
          <input style={{ padding: '10px' }} name="area_size" value={formData.area_size} onChange={handleChange} placeholder="Area (Ha)" />
        </div>

        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' }}>
          {updating ? 'Saving...' : 'Sync Registry Changes'}
        </button>
      </form>
    </div>
  );
};

export default FarmerUpdateProfile;
