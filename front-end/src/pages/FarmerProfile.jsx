import React, { useState } from 'react'; 
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { MdCameraAlt, MdAgriculture, MdLocationOn, MdPets } from 'react-icons/md';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farm_name: '', farm_type: '', public_farmer_id: '',
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
      await api.post('/farmers/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus({ msg: 'Success! Farmer Profile Created', isError: false });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setStatus({ msg: 'Error: ' + (err.response?.data?.error || 'Server error'), isError: true });
    } finally { setLoading(false); }
  };

  const s = {
    pageWrapper: {
      minHeight: '100vh',
      width: '100vw', // Ensures it stays within viewport width
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '40px 15px',
      boxSizing: 'border-box', // Crucial to prevent horizontal scroll
      overflowX: 'hidden'      // Safety block
    },
    container: { 
      maxWidth: '850px', 
      width: '100%',
      padding: 'clamp(20px, 5vw, 50px)', // Responsive padding
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '24px', 
      boxSizing: 'border-box'
    },
    title: { textAlign: 'center', color: '#1b4332', fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' },
    subtitle: { textAlign: 'center', color: '#40916c', marginBottom: '40px', fontSize: '1.2rem' },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '10px', color: '#2d6a4f', fontSize: '1.4rem', fontWeight: '800', marginTop: '30px', borderBottom: '2px solid #d8f3dc', paddingBottom: '8px' },
    group: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '10px', fontWeight: '700', color: '#1b4332', fontSize: '1.05rem' },
    input: { width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #d8f3dc', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '18px', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800', fontSize: '1.3rem', marginTop: '30px' },
    photoUpload: { width: '140px', height: '140px', margin: '0 auto 30px', borderRadius: '50%', border: '4px solid #b7e4c7', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#e9f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  };

  return (
    <div style={s.pageWrapper}>
      <div style={s.container}>
        <h2 style={s.title}>Farmer Onboarding</h2>
        <p style={s.subtitle}>Complete your profile to access specialized farming tools</p>
        
        {status.msg && (
          <div style={{ backgroundColor: status.isError ? '#ffe5ec' : '#d8f3dc', color: status.isError ? '#d00000' : '#1b4332', padding: '15px', borderRadius: '12px', textAlign: 'center', marginBottom: '25px', fontWeight: '700' }}>
            {status.msg}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center' }}>
            <label style={s.photoUpload}>
              {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
              <div style={{ color: '#74c69d' }}><MdCameraAlt size={50} /><div style={{ fontSize: '0.8rem', fontWeight: '800' }}>PHOTO</div></div>}
              <input type="file" onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
            </label>
          </div>

          <div style={s.sectionTitle}><MdAgriculture size={28}/> Farm Details</div>
          <div style={s.group}><label style={s.label}>Farm Name</label><input style={s.input} name="farm_name" onChange={handleChange} placeholder="Green Valley Estate" required /></div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
            <div style={s.group}><label style={s.label}>Farm Type</label><input style={s.input} name="farm_type" onChange={handleChange} /></div>
            <div style={s.group}><label style={s.label}>Public ID</label><input style={s.input} name="public_farmer_id" onChange={handleChange} /></div>
          </div>

          <div style={s.sectionTitle}><MdLocationOn size={28}/> Land Assets</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
            <div style={s.group}><label style={s.label}>Plot Name</label><input style={s.input} name="plot_name" onChange={handleChange} required /></div>
            <div style={s.group}><label style={s.label}>Area (Ha)</label><input style={s.input} type="number" step="0.1" name="area_size" onChange={handleChange} required /></div>
          </div>

          <button type="submit" disabled={loading} style={{...s.button, opacity: loading ? 0.7 : 1}}>
            {loading ? 'Creating...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile;
