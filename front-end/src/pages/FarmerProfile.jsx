import React, { useState } from 'react';
import api from '../api/axios';

const FarmerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    // Fields matching your controller destructuring
    full_name: '', phone: '', email: '', password: '',
    region: '', zone: '', woreda: '', kebele: '',
    farm_name: 'My Farm', farm_type: '', public_farmer_id: '',
    plot_name: '', area_size: '',
    tag_number: '', species: '' // Added to match your controller
  });

  const [photoFile, setPhotoFile] = useState(null); // Store actual file
  const [preview, setPreview] = useState(''); // For UI preview
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', isError: false });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); // Save file for upload
      setPreview(URL.createObjectURL(file)); // Create preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ msg: '', isError: false });

    // 🏆 Use FormData for Multi-part (Image + Text)
    const data = new FormData();
    
    // Append the photo with the key 'photo' (matches upload.single('photo') in routes)
    if (photoFile) {
      data.append('photo', photoFile);
    }

    // Append all text fields
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      // Endpoint updated to match our farmerRoutes.js
      await api.post('/farmers/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus({ msg: 'Success! Farmer Profile and assets created.', isError: false });
    } catch (err) {
      setStatus({ 
        msg: 'Failed: ' + (err.response?.data?.error || 'Server error'), 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep your existing return statement, just update the photo <img> src to {preview})
