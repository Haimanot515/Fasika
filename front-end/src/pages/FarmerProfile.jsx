import React, { useState, useEffect } from 'react'; 
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

    // Based on your controller: req.file is handled by 'photo'
    const data = new FormData();
    if (photoFile) data.append('photo', photoFile);
    
    // Append fields exactly as your INSERT queries expect
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await api.post('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ msg: 'Farmer Profile Created Successfully!', isError: false });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setStatus({ 
        msg: 'Error: ' + (err.response?.data?.error || 'Server error'), 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const s = {
    wrapper: { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial' },
    section: { marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' },
    input: { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '15px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }
  };

  return (
    <div style={s.wrapper}>
      <h1 style={{textAlign: 'center'}}>Farmer Onboarding</h1>
      {status.msg && <div style={{color: status.isError ? 'red' : 'green', textAlign: 'center'}}>{status.msg}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={s.section}>
          <h3>Profile Image</h3>
          {preview && <img src={preview} alt="Preview" style={{width: '100px', height: '100px', borderRadius: '50%'}} />}
          <input type="file" onChange={handlePhotoChange} />
        </div>

        <div style={s.section}>
          <h3>Farm Registry</h3>
          <input style={s.input} name="farm_name" placeholder="Farm Name" onChange={handleChange} required />
          <select style={s.input} name="farm_type" onChange={handleChange} required>
            <option value="">Select Farm Type</option>
            <option value="Crop">Crop</option>
            <option value="Livestock">Livestock</option>
          </select>
          <input style={s.input} name="public_farmer_id" placeholder="Public Farmer ID" onChange={handleChange} />
        </div>

        <div style={s.section}>
          <h3>Land & Animals</h3>
          <input style={s.input} name="plot_name" placeholder="Plot Name" onChange={handleChange} required />
          <input style={s.input} type="number" name="area_size" placeholder="Area Size (Ha)" onChange={handleChange} required />
          <input style={s.input} name="tag_number" placeholder="Animal Tag Number (Optional)" onChange={handleChange} />
          <input style={s.input} name="species" placeholder="Animal Species" onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading} style={s.button}>
          {loading ? 'Creating Registry...' : 'Complete Onboarding'}
        </button>
      </form>
    </div>
  );
};

export default FarmerProfile;
