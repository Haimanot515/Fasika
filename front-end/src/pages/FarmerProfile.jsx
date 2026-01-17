import React, { useState, useEffect } from 'react'; 
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', phone: '', email: '', password: '',
    farm_name: 'My Farm', farm_type: '', public_farmer_id: '',
    plot_name: '', area_size: '', tag_number: '', species: '' 
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
    const data = new FormData();
    if (photoFile) data.append('photo', photoFile);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      // ✅ CORRECTED PATH: /farmers/profile
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
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
      <h2>Farmer Onboarding</h2>
      {status.msg && <div style={{ color: status.isError ? 'red' : 'green' }}>{status.msg}</div>}
      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Full Name" onChange={handleChange} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input name="phone" placeholder="Phone" onChange={handleChange} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Register'}</button>
      </form>
    </div>
  );
};

export default FarmerProfile;
