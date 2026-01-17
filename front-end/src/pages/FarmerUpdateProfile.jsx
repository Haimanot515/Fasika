import React, { useState, useEffect } from 'react'; // ✅ Fixes useEffect error
import api from '../api/axios';

const FarmerUpdateProfile = () => {
  const [formData, setFormData] = useState({
    farm_name: '', farm_type: '', public_farmer_id: '',
    plot_name: '', area_size: '', tag_number: '', species: '',
    photo_url: '' 
  });

  const [photoFile, setPhotoFile] = useState(null); 
  const [preview, setPreview] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  // 1. Fetch data (Standardized to /profile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ CORRECTED: No more /my-profile
        const res = await api.get('/farmers/profile'); 
        const data = res.data.data;
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
        setStatus({ msg: 'Failed to load profile', isError: true });
      } finally { setLoading(false); }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const data = new FormData();
    if (photoFile) data.append('photo', photoFile);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      // ✅ CORRECTED: No more /update-profile
      await api.put('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Update successful!', isError: false });
    } catch (err) {
      setStatus({ msg: 'Update failed', isError: true });
    } finally { setUpdating(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
      <h1>Update Profile</h1>
      {status.msg && <div style={{ color: status.isError ? 'red' : 'green' }}>{status.msg}</div>}
      <form onSubmit={handleSubmit}>
        {preview && <img src={preview} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', display: 'block', margin: 'auto' }} />}
        <input type="file" onChange={handlePhotoChange} style={{ margin: '10px auto', display: 'block' }} />
        <input name="farm_name" value={formData.farm_name} onChange={handleChange} placeholder="Farm Name" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <button type="submit" style={{ width: '100%', padding: '15px', background: '#2d6a4f', color: '#fff', border: 'none' }}>
          {updating ? 'Saving...' : 'Update Registry'}
        </button>
      </form>
    </div>
  );
};

export default FarmerUpdateProfile; // ✅ Fixes Vite build error
