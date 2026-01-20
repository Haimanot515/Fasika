import React, { useState } from 'react';
import axios from 'axios';

const AdminAddLand = () => {
    // 1. Identity & Search State
    const [targetFarmerIdentity, setTargetFarmerIdentity] = useState(''); 
    const [farmerProfile, setFarmerProfile] = useState(null); // Stores fetched info
    const [loading, setLoading] = useState(false);
    
    // 2. Land Form State
    const [formData, setFormData] = useState({
        plot_name: '', area_size: '', soil_type: '', climate_zone: '',
        region: '', zone: '', woreda: '', kebele: ''
    });

    const [landImage, setLandImage] = useState(null);
    const [crops, setCrops] = useState([{ crop_name: '', quantity: '' }]);
    const [animals, setAnimals] = useState([{ animal_type: '', head_count: '', tag_number: '' }]);

    // --- SEARCH LOGIC ---
    const lookupFarmer = async () => {
        if (!targetFarmerIdentity) return alert("Enter Email, Phone or UUID first");
        setLoading(true);
        try {
            // This endpoint should return { success: true, data: { name, phone, photo, etc } }
            const res = await axios.get(`/api/admin/farmers/search/${targetFarmerIdentity}`);
            setFarmerProfile(res.data.data);
        } catch (err) {
            alert("Farmer not found in registry.");
            setFarmerProfile(null);
        } finally {
            setLoading(false);
        }
    };

    // --- DROP LOGIC ---
    const handleDropRegistry = async (e) => {
        e.preventDefault();
        if (!farmerProfile) return alert("Please search and verify a farmer first.");
        
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('crops', JSON.stringify(crops));
        data.append('animals', JSON.stringify(animals));
        if (landImage) data.append('land_image', landImage);

        try {
            await axios.post(`/api/admin/farmer/${targetFarmerIdentity}/land`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Authority Record successfully DROPPED!");
        } catch (err) {
            alert("DROP Failed: " + err.response?.data?.message);
        }
    };

    return (
        <div className="admin-container" style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2>Admin Authority: Register Land</h2>
            
            {/* SEARCH SECTION */}
            <div className="search-box" style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px' }}>
                <label>Find Farmer (Email/Phone/UUID):</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        value={targetFarmerIdentity} 
                        onChange={(e) => setTargetFarmerIdentity(e.target.value)}
                        placeholder="e.g. farmer@email.com"
                        style={{ flex: 1, padding: '10px' }}
                    />
                    <button onClick={lookupFarmer} disabled={loading}>
                        {loading ? 'Searching...' : 'Search Farmer'}
                    </button>
                </div>
            </div>

            {/* FARMER INFO DISPLAY (Shows after search) */}
            {farmerProfile && (
                <div className="farmer-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0', padding: '15px', border: '2px solid #2ecc71', borderRadius: '8px' }}>
                    <img src={farmerProfile.photo_url || 'https://via.placeholder.com/80'} alt="Farmer" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                    <div>
                        <h3 style={{ margin: 0 }}>{farmerProfile.full_name}</h3>
                        <p style={{ margin: 0, color: '#666' }}>ID: {farmerProfile.user_internal_id}</p>
                        <p style={{ margin: 0 }}><strong>Phone:</strong> {farmerProfile.phone}</p>
                    </div>
                </div>
            )}

            {/* LAND FORM (Enabled only if farmer found) */}
            <form onSubmit={handleDropRegistry} style={{ opacity: farmerProfile ? 1 : 0.5, pointerEvents: farmerProfile ? 'all' : 'none' }}>
                <hr />
                <h3>Step 2: Plot Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" placeholder="Plot Name" required onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
                    <input type="number" placeholder="Area Size (Hectares)" required onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
                    <select required onChange={(e) => setFormData({...formData, soil_type: e.target.value})}>
                        <option value="">Select Soil Type</option>
                        <option value="Black Soil">Black Soil</option>
                        <option value="Red Soil">Red Soil</option>
                    </select>
                    <input type="text" placeholder="Climate Zone" onChange={(e) => setFormData({...formData, climate_zone: e.target.value})} />
                </div>

                <h3>Biological Assets</h3>
                <button type="button" onClick={() => setCrops([...crops, { crop_name: '', quantity: '' }])}>+ Add Crop</button>
                {crops.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <input type="text" placeholder="Crop Name" onChange={(e) => {
                            let nc = [...crops]; nc[i].crop_name = e.target.value; setCrops(nc);
                        }} />
                        <input type="number" placeholder="Qty" onChange={(e) => {
                            let nc = [...crops]; nc[i].quantity = e.target.value; setCrops(nc);
                        }} />
                    </div>
                ))}

                <h3 style={{ marginTop: '20px' }}>Land Image</h3>
                <input type="file" onChange={(e) => setLandImage(e.target.files[0])} />

                <button type="submit" className="drop-btn" style={{ width: '100%', marginTop: '30px', padding: '15px', background: '#27ae60', color: 'white', fontWeight: 'bold' }}>
                    EXECUTE REGISTRY DROP FOR {farmerProfile?.full_name?.toUpperCase()}
                </button>
            </form>
        </div>
    );
};

export default AdminAddLand;
