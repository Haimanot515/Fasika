// ... inside FarmerUpdateProfile component ...

// 1. Fetch data on mount
useEffect(() => {
  const fetchProfile = async () => {
    try {
      // ✅ CHANGED: removed /my-profile, use /profile
      const res = await api.get('/farmers/profile'); 
      const data = res.data.data;
      
      setFormData({
        farm_name: data.farm_name || '',
        farm_type: data.farm_type || '',
        public_farmer_id: data.public_farmer_id || '',
        plot_name: data.plots?.[0]?.plot_name || '',
        area_size: data.plots?.[0]?.area_size || '',
        tag_number: data.animals?.[0]?.tag_number || '',
        species: data.animals?.[0]?.species || '',
        photo_url: data.photo_url || '' 
      });
      setPreview(data.photo_url || '');
    } catch (err) {
      setStatus({ msg: 'Failed to load profile data', isError: true });
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, []);

// 2. Submit changes
const handleSubmit = async (e) => {
  e.preventDefault();
  setUpdating(true);
  setStatus({ msg: '', isError: false });

  const data = new FormData();
  if (photoFile) {
    data.append('photo', photoFile);
  }

  Object.keys(formData).forEach(key => {
    data.append(key, formData[key]);
  });

  try {
    // ✅ CHANGED: removed /update-profile, use /profile
    // ✅ Keep headers for multipart/form-data
    await api.put('/farmers/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setStatus({ msg: 'Profile updated successfully!', isError: false });
  } catch (err) {
    setStatus({ 
      msg: 'Update failed: ' + (err.response?.data?.error || 'Server error'), 
      isError: true 
    });
  } finally {
    setUpdating(false);
  }
};
