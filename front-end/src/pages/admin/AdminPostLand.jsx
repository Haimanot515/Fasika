import React, { useState } from 'react';
import axios from 'axios';

const AdminAddLand = () => {
    // 1. Identity State (The farmer the admin is targeting)
    const [targetFarmerIdentity, setTargetFarmerIdentity] = useState(''); 
    
    // 2. Land Form State
    const [formData, setFormData] = useState({
        plot_name: '',
        area_size: '',
        soil_type: '',
        climate_zone: '',
        region: '',
        zone: '',
        woreda: '',
        kebele: ''
    });

    const [landImage, setLandImage] = useState(null);
    const [crops, setCrops] = useState([{ crop_name: '', quantity: '' }]);
    const [animals, setAnimals] = useState([{ animal_type: '', head_count: '', tag_number: '' }]);

    // Handlers for Dynamic Arrays
    const addCropField = () => setCrops([...crops, { crop_name: '', quantity: '' }]);
    const addAnimalField = () => setAnimals([...animals, { animal_type: '', head_count: '', tag_number: '' }]);

    const handleDropRegistry = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        // Append Land Details
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // Append Biological Assets
        data.append('crops', JSON.stringify(crops));
        data.append('animals', JSON.stringify(animals));
        
        // Append Image File
        if (landImage) data.append('land_image', landImage);

        try {
            // TARGETED DROP: URL contains the farmer's email/phone/uuid
            const response = await axios.post(
                `/api/admin/farmer/${targetFarmerIdentity}/land`, 
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert("Authority Record successfully DROPPED into Registry!");
        } catch (err) {
            console.error(err);
            alert("DROP Failed: " + err.response?.data?.message);
        }
    };

    return (
        <div className="admin-container">
            <h2>Admin Authority: Register Land</h2>
            
            {/* Identity Search Section */}
            <section className="identity-section">
                <label>Target Farmer (Email, Phone, or UUID):</label>
                <input 
                    type="text" 
                    value={targetFarmerIdentity} 
                    onChange={(e) => setTargetFarmerIdentity(e.target.value)}
                    placeholder="e.g. farmer@email.com or +251..."
                    required
                />
            </section>

            <form onSubmit={handleDropRegistry}>
                {/* Core Land Data */}
                <div className="grid-inputs">
                    <input type="text" placeholder="Plot Name" onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
                    <input type="number" placeholder="Area Size (Hectares)" onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
                    <select onChange={(e) => setFormData({...formData, soil_type: e.target.value})}>
                        <option value="">Select Soil</option>
                        <option value="Black Soil">Black Soil</option>
                        <option value="Red Soil">Red Soil</option>
                    </select>
                </div>

                {/* Dynamic Crops Section */}
                <h3>Crops to DROP</h3>
                {crops.map((c, i) => (
                    <div key={i} className="asset-row">
                        <input type="text" placeholder="Crop Name" onChange={(e) => {
                            const newCrops = [...crops];
                            newCrops[i].crop_name = e.target.value;
                            setCrops(newCrops);
                        }} />
                    </div>
                ))}
                <button type="button" onClick={addCropField}>+ Add Crop</button>

                {/* Image Upload */}
                <h3>Registry Image</h3>
                <input type="file" onChange={(e) => setLandImage(e.target.files[0])} />

                <button type="submit" className="drop-btn">EXECUTE REGISTRY DROP</button>
            </form>
        </div>
    );
};

export default AdminAddLand;
