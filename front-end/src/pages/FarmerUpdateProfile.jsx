import React, { useState, useEffect } from 'react'; 
import api from '../api/axios';
import { MdCameraAlt, MdAgriculture, MdLocationOn, MdPets, MdPerson } from 'react-icons/md';

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
    const data = new FormData();
    if (photoFile) data.append('photo', photoFile);

    const fields = [
      'full_name', 'region', 'zone', 'woreda', 'kebele', 
      'farm_name', 'farm_type', 'plot_name', 'area_size', 
      'tag_number', 'species', 'photo_url'
    ];

    fields.forEach(field => data.append(field, formData[field]));

    try {
      await api.put('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Farmer Profile Updated Successfully!', isError: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus({ msg: 'Update Failed: ' + (err.response?.data?.error || 'Server error'), isError: true });
    } finally {
      setUpdating(false);
    }
  };

  const s = {
    pageWrapper: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '80px 20px', // Extra top padding for navbar
      boxSizing: 'border-box',
      overflowX: 'hidden'
    },
    container: { 
      maxWidth: '850px', 
      width: '100%',
      margin: '0 auto',
      padding: 'clamp(25px, 5%, 50px)', 
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '24px', 
      boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
      boxSizing: 'border-box'
    },
    title: { textAlign: 'center', color: '#1b4332', fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' },
    subtitle: { textAlign: 'center', color: '#40916c', marginBottom: '40px', fontSize: '1.2rem', fontWeight: '500' },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '10px', color: '#2d6a4f', fontSize: '1.4rem', fontWeight: '800', marginTop: '30px', borderBottom: '2px solid #d8f3dc', paddingBottom: '8px' },
    group: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '10px', fontWeight: '700', color: '#1b4332', fontSize: '1.05rem' },
    input: { width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #d8f3dc', backgroundColor: '#f8fdf9', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '18px', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800', fontSize: '1.3rem', marginTop: '30px', boxShadow: '0 6px 20px rgba(45, 106, 79, 0.4)' },
    photoUpload: { width: '140px', height: '140px', margin: '0 auto 30px', borderRadius: '50%', border: '4px solid #b7e4c7', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#e9f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  };

  if (loading) return (
    <div style={s.pageWrapper}>
      <div style={{...s.container, textAlign: 'center', color: '#2d6a4f', fontSize: '1.5rem', fontWeight: 'bold'}}>
        Syncing with Farm Registry...
      </div>
    </div>
  );

  return (
    <div style={s.pageWrapper}>
      <div style={s.container}>
        <h2 style={s.title}>Update Profile</h2>
        <p style={s.subtitle}>Modify your farm and personal records</p>
        
        {status.msg && (
          <div style={{ backgroundColor: status.isError ? '#ffe5ec' : '#d8f3dc', color: status.isError ? '#d00000' : '#1b4332', padding: '15px', borderRadius: '12px', textAlign: 'center', marginBottom: '25px', fontWeight: '700', fontSize: '1.1rem' }}>
            {status.msg}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <label style={s.photoUpload}>
              {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                <div style={{ textAlign: 'center', color: '#74c69d' }}>
                  <MdCameraAlt size={50} />
                  <div style={{ fontSize: '0.8rem', fontWeight: '800' }}>CHANGE</div>
                </div>
              )}
              <input type="file" onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
            </label>
          </div>

          <div style={s.sectionTitle}><MdPerson size={28}/> Personal Information</div>
          <div style={s.group}>
            <label style={s.label}>Full Name</label>
            <input style={s.input} name="full_name" value={formData.full_name} onChange={handleChange} />
          </div>

          <div style={s.sectionTitle}><MdLocationOn size={28}/> Location Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            <div style={s.group}><label style={s.label}>Region</label><input style={s.input} name="region" value={formData.region} onChange={handleChange} /></div>
            <div style={s.group}><label style={s.label}>Zone</label><input style={s.input} name="zone" value={formData.zone} onChange={handleChange} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            <div style={s.group}><label style={s.label}>Woreda</label><input style={s.input} name="woreda" value={formData.woreda} onChange={handleChange} /></div>
            <div style={s.group}><label style={s.label}>Kebele</label><input style={s.input} name="kebele" value={formData.kebele} onChange={handleChange} /></div>
          </div>

          <div style={s.sectionTitle}><MdAgriculture size={28}/> Farm & Plot Asset</div>
          <div style={s.group}>
            <label style={s.label}>Farm Name</label>
            <input style={s.input} name="farm_name" value={formData.farm_name} onChange={handleChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            <div style={s.group}><label style={s.label}>Plot Name</label><input style={s.input} name="plot_name" value={formData.plot_name} onChange={handleChange} /></div>
            <div style={s.group}><label style={s.label}>Area (Ha)</label><input style={s.input} name="area_size" value={formData.area_size} onChange={handleChange} /></div>
          </div>

          <div style={s.sectionTitle}><MdPets size={28}/> Livestock Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            <div style={s.group}><label style={s.label}>Tag Number</label><input style={s.input} name="tag_number" value={formData.tag_number} onChange={handleChange} /></div>
            <div style={s.group}><label style={s.label}>Species</label><input style={s.input} name="species" value={formData.species} onChange={handleChange} /></div>
          </div>

          <button type="submit" disabled={updating} style={{...s.button, opacity: updating ? 0.7 : 1}}>
            {updating ? 'Saving Changes...' : 'Sync Registry Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerUpdateProfile;
