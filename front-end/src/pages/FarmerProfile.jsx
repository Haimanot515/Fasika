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
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#1b4332',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed', // ✅ Fixes the background to prevent white gaps
      backgroundRepeat: 'no-repeat',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflowX: 'hidden'
    },
    container: { 
      maxWidth: '850px', 
      width: '100%',
      minHeight: '100vh', // ✅ Stretches from top to bottom
      padding: 'clamp(25px, 5%, 60px)', 
      backgroundColor: 'rgba(255, 255, 255, 0.96)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '0', // ✅ Exactly like update (no rounded corners)
      boxShadow: '0 0 50px rgba(0,0,0,0.5)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    },
    title: { textAlign: 'center', color: '#1b4332', fontSize: '2.8rem', fontWeight: '900', marginBottom: '10px', marginTop: '40px' },
    subtitle: { textAlign: 'center', color: '#40916c', marginBottom: '50px', fontSize: '1.3rem', fontWeight: '500' },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '12px', color: '#2d6a4f', fontSize: '1.5rem', fontWeight: '800', marginTop: '40px', borderBottom: '2px solid #d8f3dc', paddingBottom: '10px' },
    group: { marginBottom: '25px' },
    label: { display: 'block', marginBottom: '12px', fontWeight: '700', color: '#1b4332', fontSize: '1.1rem' },
    input: { width: '100%', padding: '16px 20px', borderRadius: '12px', border: '2px solid #d8f3dc', backgroundColor: '#f8fdf9', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '22px', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800', fontSize: '1.5rem', marginTop: '50px', marginBottom: '60px', boxShadow: '0 6px 20px rgba(45, 106, 79, 0.4)' },
    photoUpload: { width: '160px', height: '160px', margin: '0 auto 40px', borderRadius: '50%', border: '5px solid #b7e4c7', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#e9f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }
  };

  return (
    <div style={s.pageWrapper}>
      <div style={s.container}>
        <h2 style={s.title}>Farmer Onboarding</h2>
        <p style={s.subtitle}>Complete your profile to access specialized farming tools</p>
        
        {status.msg && (
          <div style={{ backgroundColor: status.isError ? '#ffe5ec' : '#d8f3dc', color: status.isError ? '#d00000' : '#1b4332', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px', fontWeight: '700', fontSize: '1.2rem' }}>
            {status.msg}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <label style={s.photoUpload}>
              {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                <div style={{ textAlign: 'center', color: '#74c69d' }}>
                  <MdCameraAlt size={60} />
                  <div style={{ fontSize: '0.9rem', fontWeight: '900' }}>PHOTO</div>
                </div>
              )}
              <input type="file" onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
            </label>
          </div>

          <div style={s.sectionTitle}><MdAgriculture size={30}/> Farm Details</div>
          <div style={s.group}>
            <label style={s.label}>Farm Name</label>
            <input style={s.input} name="farm_name" onChange={handleChange} placeholder="Green Valley Estate" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div style={s.group}><label style={s.label}>Farm Type</label><input style={s.input} name="farm_type" onChange={handleChange} /></div>
            <div style={s.group}><label style={s.label}>Public ID</label><input style={s.input} name="public_farmer_id" onChange={handleChange} /></div>
          </div>

          <div style={s.sectionTitle}><MdLocationOn size={30}/> Land Assets</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div style={s.group}>
              <label style={s.label}>Plot Name</label>
              <input style={s.input} name="plot_name" onChange={handleChange} required />
            </div>
            <div style={s.group}>
              <label style={s.label}>Area (Ha)</label>
              <input style={s.input} type="number" step="0.1" name="area_size" onChange={handleChange} required />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{...s.button, opacity: loading ? 0.7 : 1}}
          >
            {loading ? 'Creating...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile;
