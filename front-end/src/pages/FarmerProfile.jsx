import React, { useState } from 'react'; 
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farm_name: '',
    farm_type: '',
    public_farmer_id: '',
    plot_name: '',
    area_size: '',
    tag_number: '',
    species: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

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
    setLoading(true);
    setStatus({ msg: '', isError: false });

    const data = new FormData();
    // Your controller looks for req.file (photo)
    if (photoFile) data.append('photo', photoFile);
    
    // Your controller destructures these from req.body
    data.append('farm_name', formData.farm_name);
    data.append('farm_type', formData.farm_type);
    data.append('public_farmer_id', formData.public_farmer_id);
    data.append('plot_name', formData.plot_name);
    data.append('area_size', formData.area_size);
    data.append('tag_number', formData.tag_number);
    data.append('species', formData.species);

    try {
      await api.post('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Success! Farmer Profile Created', isError: false });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setStatus({ msg: 'Error: ' + (err.response?.data?.error || 'Server error'), isError: true });
    } finally {
      setLoading(false);
    }
  };

  const s = {
    container: { maxWidth: '700px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', color: '#2d6a4f', marginBottom: '20px' },
    group: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { width: '100%', padding: '12px', backgroundColor: '#2d6a4f', color: '#white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>Farmer Onboarding</h2>
      {status.msg && <div style={{ color: status.isError ? 'red' : 'green', textAlign: 'center', marginBottom: '10px' }}>{status.msg}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {preview && <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />}
          <input type="file" onChange={handlePhotoChange} style={{ display: 'block', margin: '10px auto' }} />
        </div>

        <div style={s.group}>
          <label style={s.label}>Farm Name</label>
          <input style={s.input} name="farm_name" onChange={handleChange} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={s.group}>
            <label style={s.label}>Farm Type</label>
            <input style={s.input} name="farm_type" onChange={handleChange} placeholder="e.g., Crop" />
          </div>
          <div style={s.group}>
            <label style={s.label}>Public ID</label>
            <input style={s.input} name="public_farmer_id" onChange={handleChange} placeholder="F-123" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={s.group}>
            <label style={s.label}>Plot Name</label>
            <input style={s.input} name="plot_name" onChange={handleChange} required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Area (Ha)</label>
            <input style={s.input} type="number" name="area_size" onChange={handleChange} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={s.group}>
            <label style={s.label}>Tag Number</label>
            <input style={s.input} name="tag_number" onChange={handleChange} />
          </div>
          <div style={s.group}>
            <label style={s.label}>Species</label>
            <input style={s.input} name="species" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" disabled={loading} style={s.button}>
          {loading ? 'Creating...' : 'Register Profile'}
        </button>
      </form>
    </div>
  );
};

export default FarmerProfile;
