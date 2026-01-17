import React, { useState, useEffect } from 'react'; // <--- THIS LINE IS THE FIX
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const FarmerUpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farm_name: '', farm_type: '', public_farmer_id: '',
    plot_name: '', area_size: '',
    tag_number: '', species: '',
    photo_url: '' 
  });

  const [photoFile, setPhotoFile] = useState(null); 
  const [preview, setPreview] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  // 1. Fetch data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Standardized path
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus({ msg: '', isError: false });

    const data = new FormData();
    if (photoFile) {
      data.append('photo', photoFile);
    }

    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      // ✅ Standardized path
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

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Profile...</div>;

  return (
    <div style={{maxWidth: '800px', margin: 'auto', padding: '20px'}}>
      <h1>Update Farmer Profile</h1>
      {status.msg && <div style={{color: status.isError ? 'red' : 'green'}}>{status.msg}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
           {preview && <img src={preview} alt="Profile" style={{width: '150px', height: '150px', borderRadius: '50%'}} />}
           <input type="file" onChange={handlePhotoChange} style={{display: 'block', margin: '10px auto'}} />
        </div>
        
        <input name="farm_name" value={formData.farm_name} onChange={handleChange} placeholder="Farm Name" style={{width: '100%', padding: '10px', marginBottom: '10px'}} />
        {/* Add other inputs here following the same pattern */}
        
        <button type="submit" disabled={updating} style={{width: '100%', padding: '15px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', cursor: 'pointer'}}>
          {updating ? 'Saving...' : 'Update Registry'}
        </button>
      </form>
    </div>
  );
};

export default FarmerUpdateProfile; // <--- This fixes the "default export" error
