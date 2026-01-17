import React, { useState } from 'react';
import api from '../api/axios';

const FarmerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    // 1. Users Table Info
    full_name: '', phone: '', email: '', password: '',
    region: '', zone: '', woreda: '', kebele: '',
    // 2. Farmers Table Info
    farm_name: 'My Farm', farm_type: '', public_farmer_id: '',
    // 3. Land Plots Table Info
    plot_name: '', area_size: '',
    // 4. Crops Table Info
    crop_name: '', planting_date: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  // --- Inline Styles ---
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
    alert: (isErr) => ({ padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', backgroundColor: isErr ? '#fff5f5' : '#f0fff4', color: isErr ? '#c53030' : '#276749', border: `1px solid ${isErr ? '#feb2b2' : '#9ae6b4'}` })
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ msg: '', isError: false });

    try {
      // This sends all section data to your backend for a single atomic transaction
      await api.post('/farmers/register-complete', formData);
      setStatus({ msg: 'Success! Your account and farm registry are now synchronized.', isError: false });
    } catch (err) {
      setStatus({ msg: 'Registration Failed: ' + (err.response?.data?.message || 'Server connection error'), isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h1 style={s.header}>Farmer Ecosystem Onboarding</h1>
        
        {status.msg && <div style={s.alert(status.isError)}>{status.msg}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* SECTION 1: ACCOUNT (USERS TABLE) */}
          <div style={s.section}>
            <div style={s.sectionTitle}>1. Account & Security (Users Table)</div>
            <div style={s.grid}>
              <div style={s.inputGroup}>
                <label style={s.label}>Full Name</label>
                <input style={s.input} name="full_name" required onChange={handleChange} />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Phone Number</label>
                <input style={s.input} name="phone" required onChange={handleChange} />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Email Address</label>
                <input style={s.input} type="email" name="email" onChange={handleChange} />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Password</label>
                <input style={s.input} type="password" name="password" required onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION 2: FARM REGISTRY (FARMERS TABLE) */}
          <div style={s.section}>
            <div style={s.sectionTitle}>2. Farm Registry Details (Farmers Table)</div>
            <div style={s.grid}>
              <div style={s.inputGroup}>
                <label style={s.label}>Farm Name</label>
                <input style={s.input} name="farm_name" placeholder="My Farm" onChange={handleChange} />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Farm Type</label>
                <select style={s.input} name="farm_type" onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="Crop">Crop Production</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Mixed">Mixed Farming</option>
                </select>
              </div>
              <div style={{...s.inputGroup, gridColumn: 'span 2'}}>
                <label style={s.label}>Public Farmer ID (Unique Identifier)</label>
                <input style={s.input} name="public_farmer_id" placeholder="e.g. FARM-1002" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION 3: LAND & CROPS (LAND_PLOTS & CROPS TABLES) */}
          <div style={s.section}>
            <div style={s.sectionTitle}>3. Initial Land Plot & Crop</div>
            <div style={s.grid}>
              <div style={s.inputGroup}>
                <label style={s.label}>Initial Plot Name</label>
                <input style={s.input} name="plot_name" placeholder="e.g. North Field" required onChange={handleChange} />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Area Size (Ha)</label>
                <input style={s.input} type="number" step="0.01" name="area_size" required onChange={handleChange} />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Crop to Plant</label>
                <input style={s.input} name="crop_name" placeholder="e.g. Maize" onChange={handleChange} />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Planting Date</label>
                <input style={s.input} type="date" name="planting_date" onChange={handleChange} />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{...s.button, opacity: loading ? 0.7 : 1}}
          >
            {loading ? 'Creating Multi-Table Records...' : 'Submit Full Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerRegistrationForm;
