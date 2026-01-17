import React, { useState, useEffect } from 'react'; 
import api from '../api/axios';

const FarmerUpdateProfile = () => {
  const [formData, setFormData] = useState({
    full_name: '', region: '', zone: '', woreda: '', kebele: '',
    farm_name: '', farm_type: '', plot_name: '', area_size: '',
    tag_number: '', species: '', photo_url: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  // Match the GET controller (Retrieves unified profile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/farmers/profile');
        const d = res.data.data;
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
        setStatus({ msg: 'Load failed', isError: true });
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
    
    // Add all fields including location data for your COALESCE query
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await api.put('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Farmer Profile Updated!', isError: false });
    } catch (err) {
      setStatus({ msg: 'Update Failed', isError: true });
    } finally { setUpdating(false); }
  };

  if (loading) return <div>Loading Profile...</div>;

  return (
    <div style={{maxWidth: '800px', margin: 'auto', padding: '20px'}}>
      <h2>Edit Farmer Profile</h2>
      {status.msg && <div style={{color: status.isError ? 'red' : 'green'}}>{status.msg}</div>}
      <form onSubmit={handleSubmit}>
        <img src={preview} alt="Profile" style={{width: '100px', borderRadius: '50%'}} />
        <input type="file" onChange={handlePhotoChange} />
        
        <input style={{display:'block', width:'100%', margin:'10px 0'}} name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" />
        <input style={{display:'block', width:'100%', margin:'10px 0'}} name="region" value={formData.region} onChange={handleChange} placeholder="Region" />
        <input style={{display:'block', width:'100%', margin:'10px 0'}} name="farm_name" value={formData.farm_name} onChange={handleChange} placeholder="Farm Name" />
        <input style={{display:'block', width:'100%', margin:'10px 0'}} name="plot_name" value={formData.plot_name} onChange={handleChange} placeholder="Plot Name" />
        <input style={{display:'block', width:'100%', margin:'10px 0'}} type="number" name="area_size" value={formData.area_size} onChange={handleChange} placeholder="Area Size" />
        
        <button type="submit" style={{width:'100%', padding:'10px', background:'#2d6a4f', color:'white'}}>
          {updating ? 'Saving...' : 'Save Registry Changes'}
        </button>
      </form>
    </div>
  );
};

export default FarmerUpdateProfile;
