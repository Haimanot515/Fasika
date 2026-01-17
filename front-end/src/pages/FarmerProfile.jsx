import React, { useState, useEffect } from 'react'; // Added useEffect
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', phone: '', email: '', password: '',
    farm_name: 'My Farm', farm_type: '', public_farmer_id: '',
    plot_name: '', area_size: '',
    tag_number: '', species: '' 
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  const s = {
    wrapper: { maxWidth: '850px', margin: '40px auto', padding: '20px', backgroundColor: '#f4f7f6', borderRadius: '15px' },
    card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' },
    header: { color: '#1b4332', textAlign: 'center', marginBottom: '30px' },
    section: { marginBottom: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '10px' },
    sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '15px', borderBottom: '2px solid #d8f3dc' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '100%', boxSizing: 'border-box' },
    button: { width: '100%', padding: '16px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    photoPreview: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2d6a4f', marginBottom: '10px' }
  };

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
    const data = new FormData();
    if (photoFile) data.append('photo', photoFile);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await api.post('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Success! Account created.', isError: false });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({ msg: 'Error: ' + (err.response?.data?.error || 'Server error'), isError: true });
    } finally { setLoading(false); }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h1 style={s.header}>Farmer Onboarding</h1>
        {status.msg && <div style={{color: status.isError ? 'red' : 'green'}}>{status.msg}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{textAlign: 'center', marginBottom: '20px'}}>
            {preview && <img src={preview} alt="Preview" style={s.photoPreview} />}
            <input type="file" onChange={handlePhotoChange} />
          </div>
          <div style={s.section}>
            <div style={s.grid}>
              <input style={s.input} name="full_name" placeholder="Full Name" onChange={handleChange} required />
              <input style={s.input} name="phone" placeholder="Phone" onChange={handleChange} required />
              <input style={s.input} type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" style={s.button}>{loading ? 'Saving...' : 'Submit Registration'}</button>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile; // Fixed default export
