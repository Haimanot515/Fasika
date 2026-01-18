import React, { useState } from "react";
import api from "../../api/axios"; 

const AddLand = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [landImage, setLandImage] = useState(null);
    
    // Core Land Data
    const [formData, setFormData] = useState({
        plot_name: "", area_size: "", soil_type: "Nitosols",
        climate_zone: "Weyna Dega", region: "", zone: "", woreda: "", kebele: ""
    });

    // Dynamic Assets Lists
    const [crops, setCrops] = useState([]);
    const [animals, setAnimals] = useState([]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Helper to add empty rows for assets
    const addCrop = () => setCrops([...crops, { crop_name: "", quantity: 0 }]);
    const addAnimal = () => setAnimals([...animals, { animal_type: "", head_count: 0 }]);

    const handleCropChange = (index, field, value) => {
        const newCrops = [...crops];
        newCrops[index][field] = value;
        setCrops(newCrops);
    };

    const handleAnimalChange = (index, field, value) => {
        const newAnimals = [...animals];
        newAnimals[index][field] = value;
        setAnimals(newAnimals);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();

        // 1. Append Land Details
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // 2. Append Assets as JSON Strings (Matches your Controller's JSON.parse)
        data.append("crops", JSON.stringify(crops));
        data.append("animals", JSON.stringify(animals));

        // 3. Append Image
        if (landImage) data.append("land_image", landImage);

        try {
            const response = await api.post("/farmer/farm/land", data);
            if (response.data.success) {
                alert("Registry DROP Success!");
                window.location.reload(); // Refresh to clear
            }
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.error || "DROP Failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', background: '#fff' }}>
            <h2>Register Land & Assets</h2>
            <form onSubmit={handleSubmit}>
                {/* --- Land Details --- */}
                <input type="text" name="plot_name" placeholder="Plot Name" onChange={handleChange} required />
                <input type="number" name="area_size" placeholder="Area Size" onChange={handleChange} required />
                <select name="soil_type" onChange={handleChange}>
                    <option value="Nitosols">Nitosols</option>
                    <option value="Vertisols">Vertisols</option>
                </select>

                <hr />
                {/* --- Crops Section --- */}
                <h3>Crops</h3>
                {crops.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                        <input type="text" placeholder="Crop Name" onChange={(e) => handleCropChange(i, "crop_name", e.target.value)} />
                        <input type="number" placeholder="Qty" onChange={(e) => handleCropChange(i, "quantity", e.target.value)} />
                    </div>
                ))}
                <button type="button" onClick={addCrop}>+ Add Crop</button>

                <hr />
                {/* --- Animals Section --- */}
                <h3>Animals</h3>
                {animals.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                        <input type="text" placeholder="Animal Type" onChange={(e) => handleAnimalChange(i, "animal_type", e.target.value)} />
                        <input type="number" placeholder="Heads" onChange={(e) => handleAnimalChange(i, "head_count", e.target.value)} />
                    </div>
                ))}
                <button type="button" onClick={addAnimal}>+ Add Animal</button>

                <hr />
                <input type="file" onChange={(e) => setLandImage(e.target.files[0])} />
                
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: 'green', color: 'white' }}>
                    {loading ? "Syncing..." : "DROP TO REGISTRY"}
                </button>
            </form>
        </div>
    );
};

export default AddLand;
