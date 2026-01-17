import React, { useState, useEffect } from 'react'; 
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', phone: '', email: '', password: '',
    region: '', zone: '', woreda: '', kebele: '',
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
    section: { marginBottom: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fafbfc' },
    sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '15px', borderBottom: '2px solid #d8f3dc', paddingBottom: '5px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', marginBottom: '5px', fontWeight: '600', color: '#4a5568' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none' },
    button: { width: '100%', padding: '16px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '20px' },
    alert: (isErr) => ({ padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', backgroundColor: isErr ? '#fff5f5' : '#f0fff4', color: isErr ? '#c53030' : '#276749', border: `1px solid ${isErr ? '#feb2b2' : '#9ae6b4'}` }),
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
    setStatus({ msg: '', isError: false });

    const data = new FormData();
    if (photoFile) data.append('photo', photoFile);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      // ✅ Using corrected path
      await api.post('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Success! Your account and farm registry are now synchronized.', isError: false });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({ msg: 'Registration Failed: ' + (err.response?.data?.error || 'Server error'), isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h1 style={s.header}>Farmer Profile Onboarding</h1>
        {status.msg && <div style={s.alert(status.isError)}>{status.msg}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{...s.section, textAlign: 'center'}}>
            <div style={s.sectionTitle}>Profile Photo</div>
            {preview && <img src={preview} alt="Preview" style={s.photoPreview} />}
            <div style={s.inputGroup}>
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{...s.input, border: 'none'}} />
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>1. Account & Security</div>
            <div style={s.grid}>
              <div style={s.inputGroup}><label style={s.label}>Full Name</label><input style={s.input} name="full_name" required onChange={handleChange} /></div>
              <div style={s.inputGroup}><label style={s.label}>Phone</label><input style={s.input} name="phone" required onChange={handleChange} /></div>
              <div style={s.inputGroup}><label style={s.label}>Email</label><input style={s.input} type="email" name="email" onChange={handleChange} /></div>
              <div style={s.inputGroup}><label style={s.label}>Password</label><input style={s.input} type="password" name="password" required onChange={handleChange} /></div>
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>2. Farm Details</div>
            <div style={s.grid}>
              <div style={s.inputGroup}><label style={s.label}>Farm Name</label><input style={s.input} name="farm_name" onChange={handleChange} /></div>
              <div style={s.inputGroup}>
                <label style={s.label}>Farm Type</label>
                <select style={s.input} name="farm_type" onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="Crop">Crop</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div style={{...s.inputGroup, gridColumn: 'span 2'}}><label style={s.label}>Public Farmer ID</label><input style={s.input} name="public_farmer_id" placeholder="FARM-001" onChange={handleChange} /></div>
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>3. Land & Assets</div>
            <div style={s.grid}>
              <div style={s.inputGroup}><label style={s.label}>Plot Name</label><input style={s.input} name="plot_name" required onChange={handleChange} /></div>
              <div style={s.inputGroup}><label style={s.label}>Area (Ha)</label><input style={s.input} type="number" step="0.01" name="area_size" required onChange={handleChange} /></div>
              <div style={s.inputGroup}><label style={s.label}>Tag Number</label><input style={s.input} name="tag_number" onChange={handleChange} /></div>
              <div style={s.inputGroup}><label style={s.label}>Species</label><input style={s.input} name="species" onChange={handleChange} /></div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{...s.button, opacity: loading ? 0.7 : 1}}>
            {loading ? 'Creating Records...' : 'Submit Full Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile;
