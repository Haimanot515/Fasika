import React, { useState } from "react";
import api from "../../api/axios"; 

const AddLand = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [landImage, setLandImage] = useState(null);

    // 1. Basic Land Details
    const [formData, setFormData] = useState({
        plot_name: "",
        area_size: "",
        soil_type: "Nitosols",
        climate_zone: "Weyna Dega",
        region: "",
        zone: "",
        woreda: "",
        kebele: ""
    });

    // 2. Dynamic Asset States
    const [crops, setCrops] = useState([]);
    const [animals, setAnimals] = useState([]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Dynamic Row Logic ---
    const addCropRow = () => setCrops([...crops, { crop_name: "", quantity: "" }]);
    const removeCropRow = (index) => setCrops(crops.filter((_, i) => i !== index));
    const updateCrop = (index, field, value) => {
        const updated = [...crops];
        updated[index][field] = value;
        setCrops(updated);
    };

    const addAnimalRow = () => setAnimals([...animals, { animal_type: "", head_count: "" }]);
    const removeAnimalRow = (index) => setAnimals(animals.filter((_, i) => i !== index));
    const updateAnimal = (index, field, value) => {
        const updated = [...animals];
        updated[index][field] = value;
        setAnimals(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        const data = new FormData();
        
        // Append text fields
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // IMPORTANT: Stringify arrays so backend JSON.parse(crops) works
        data.append("crops", JSON.stringify(crops));
        data.append("animals", JSON.stringify(animals));

        if (landImage) data.append("land_image", landImage);

        try {
            const response = await api.post("/farmer/farm/land", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setStatus({ type: "success", message: "Registry Entry successfully DROPPED!" });
                // Reset everything
                setFormData({ plot_name: "", area_size: "", soil_type: "Nitosols", climate_zone: "Weyna Dega", region: "", zone: "", woreda: "", kebele: "" });
                setCrops([]);
                setAnimals([]);
                setLandImage(null);
            }
        } catch (err) {
            console.error("Submission Error:", err);
            setStatus({ type: "error", message: err.response?.data?.error || "Server connection failed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '30px auto', padding: '25px', background: '#fdfdfd', borderRadius: '12px', border: '1px solid #ddd' }}>
            <h2 style={{ color: '#1b5e20', textAlign: 'center' }}>Land Registry Registration</h2>
            
            {status.message && (
                <div style={{ padding: '15px', borderRadius: '5px', marginBottom: '20px', backgroundColor: status.type === 'success' ? '#e8f5e9' : '#ffebee', color: status.type === 'success' ? '#2e7d32' : '#c62828' }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Section 1: Land Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <input type="text" name="plot_name" placeholder="Plot Name (e.g. West Field)" value={formData.plot_name} onChange={handleInputChange} required style={inputStyle} />
                    <input type="number" name="area_size" placeholder="Area Size (Hectares)" value={formData.area_size} onChange={handleInputChange} required style={inputStyle} />
                    
                    <select name="soil_type" value={formData.soil_type} onChange={handleInputChange} style={inputStyle}>
                        <option value="Nitosols">Nitosols</option>
                        <option value="Vertisols">Vertisols</option>
                        <option value="Cambisols">Cambisols</option>
                        <option value="Fluvisols">Fluvisols</option>
                    </select>

                    <select name="climate_zone" value={formData.climate_zone} onChange={handleInputChange} style={inputStyle}>
                        <option value="Dega">Dega</option>
                        <option value="Weyna Dega">Weyna Dega</option>
                        <option value="Kolla">Kolla</option>
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '25px' }}>
                    <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleInputChange} required style={inputStyle} />
                    <input type="text" name="zone" placeholder="Zone" value={formData.zone} onChange={handleInputChange} required style={inputStyle} />
                    <input type="text" name="woreda" placeholder="Woreda" value={formData.woreda} onChange={handleInputChange} required style={inputStyle} />
                    <input type="text" name="kebele" placeholder="Kebele" value={formData.kebele} onChange={handleInputChange} required style={inputStyle} />
                </div>

                {/* Section 2: Crops Assets */}
                <h4 style={{ color: '#2e7d32' }}>Crops on Plot</h4>
                {crops.map((crop, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input type="text" placeholder="Crop Name" value={crop.crop_name} onChange={(e) => updateCrop(index, 'crop_name', e.target.value)} style={inputStyle} required />
                        <input type="number" placeholder="Quantity" value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} style={inputStyle} required />
                        <button type="button" onClick={() => removeCropRow(index)} style={{ padding: '5px 10px', color: 'red' }}>✕</button>
                    </div>
                ))}
                <button type="button" onClick={addCropRow} style={addBtnStyle}>+ Add Crop</button>

                {/* Section 3: Animals Assets */}
                <h4 style={{ color: '#2e7d32', marginTop: '20px' }}>Livestock on Plot</h4>
                {animals.map((animal, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input type="text" placeholder="Animal Type" value={animal.animal_type} onChange={(e) => updateAnimal(index, 'animal_type', e.target.value)} style={inputStyle} required />
                        <input type="number" placeholder="Head Count" value={animal.head_count} onChange={(e) => updateAnimal(index, 'head_count', e.target.value)} style={inputStyle} required />
                        <button type="button" onClick={() => removeAnimalRow(index)} style={{ padding: '5px 10px', color: 'red' }}>✕</button>
                    </div>
                ))}
                <button type="button" onClick={addAnimalRow} style={addBtnStyle}>+ Add Animal</button>

                <hr style={{ margin: '30px 0' }} />

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Upload Land/Registry Image</label>
                    <input type="file" onChange={(e) => setLandImage(e.target.files[0])} style={{ display: 'block', marginTop: '10px' }} />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {loading ? "COMMITTING TO REGISTRY..." : "DROP INTO REGISTRY"}
                </button>
            </form>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const addBtnStyle = { padding: '8px 15px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' };

export default AddLand;
