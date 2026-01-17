import React, { useState } from 'react'; 
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { MdCameraAlt, MdAgriculture, MdLocationOn, MdPets } from 'react-icons/md';

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
    if (photoFile) data.append('photo', photoFile);
    
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
    pageWrapper: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1500382017468-9049fee74a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '40px 20px'
    },
    container: { 
      maxWidth: '700px', 
      width: '100%',
      padding: '40px', 
      backgroundColor: 'rgba(255, 255, 255, 0.92)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '20px', 
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)' 
    },
    title: { 
      textAlign: 'center', 
      color: '#1b4332', 
      fontSize: '2rem',
      fontWeight: '800',
      marginBottom: '10px' 
    },
    subtitle: {
      textAlign: 'center',
      color: '#40916c',
      marginBottom: '30px',
      fontSize: '1rem'
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#2d6a4f',
      fontSize: '1.1rem',
      fontWeight: '700',
      marginTop: '20px',
      marginBottom: '15px',
      borderBottom: '1px solid #d8f3dc',
      paddingBottom: '5px'
    },
    group: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1b4332', fontSize: '0.9rem' },
    input: { 
      width: '100%', 
      padding: '12px 15px', 
      borderRadius: '10px', 
      border: '1.5px solid #d8f3dc',
      backgroundColor: '#f8fdf9',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    button: { 
      width: '100%', 
      padding: '15px', 
      backgroundColor: '#2d6a4f', 
      color: 'white', 
      border: 'none', 
      borderRadius: '12px', 
      cursor: 'pointer', 
      fontWeight: '700', 
      fontSize: '1.1rem',
      marginTop: '20px',
      transition: 'background 0.3s ease',
      boxShadow: '0 4px 15px rgba(45, 106, 79, 0.3)'
    },
    photoUpload: {
      position: 'relative',
      width: '120px',
      height: '120px',
      margin: '0 auto 20px',
      borderRadius: '50%',
      border: '3px solid #b7e4c7',
      overflow: 'hidden',
      cursor: 'pointer',
      backgroundColor: '#e9f5ee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  return (
    <div style={s.pageWrapper}>
      <div style={s.container}>
        <h2 style={s.title}>Farmer Onboarding</h2>
        <p style={s.subtitle}>Complete your profile to access specialized farming tools</p>
        
        {status.msg && (
          <div style={{ 
            backgroundColor: status.isError ? '#ffe5ec' : '#d8f3dc',
            color: status.isError ? '#d00000' : '#1b4332',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center', 
            marginBottom: '20px',
            fontWeight: '600'
          }}>
            {status.msg}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* PHOTO UPLOAD SECTION */}
          <div style={{ textAlign: 'center' }}>
            <label style={s.photoUpload}>
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#74c69d' }}>
                  <MdCameraAlt size={40} />
                  <div style={{ fontSize: '0.7rem', fontWeight: '700' }}>UPLOAD PHOTO</div>
                </div>
              )}
              <input type="file" onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
            </label>
          </div>

          {/* FARM INFO */}
          <div style={s.sectionTitle}><MdAgriculture /> Farm Details</div>
          <div style={s.group}>
            <label style={s.label}>Farm Name</label>
            <input style={s.input} name="farm_name" onChange={handleChange} placeholder="Green Valley Estate" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={s.group}>
              <label style={s.label}>Farm Type</label>
              <input style={s.input} name="farm_type" onChange={handleChange} placeholder="e.g., Crop, Dairy, Mixed" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Public ID</label>
              <input style={s.input} name="public_farmer_id" onChange={handleChange} placeholder="F-12345" />
            </div>
          </div>

          {/* LAND INFO */}
          <div style={s.sectionTitle}><MdLocationOn /> Land & Plot Assets</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={s.group}>
              <label style={s.label}>Plot Name</label>
              <input style={s.input} name="plot_name" onChange={handleChange} placeholder="North Field" required />
            </div>
            <div style={s.group}>
              <label style={s.label}>Area (Hectares)</label>
              <input style={s.input} type="number" step="0.1" name="area_size" onChange={handleChange} placeholder="5.5" required />
            </div>
          </div>

          {/* LIVESTOCK INFO */}
          <div style={s.sectionTitle}><MdPets /> Livestock (Optional)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={s.group}>
              <label style={s.label}>Tag Number</label>
              <input style={s.input} name="tag_number" onChange={handleChange} placeholder="TAG-99" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Species</label>
              <input style={s.input} name="species" onChange={handleChange} placeholder="e.g., Cattle, Poultry" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{...s.button, opacity: loading ? 0.7 : 1}}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1b4332'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2d6a4f'}
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile;
