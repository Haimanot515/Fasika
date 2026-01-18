import React, { useState } from "react";
import api from "../../api"; // Assuming this is your axios instance

const AddLand = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [landImage, setLandImage] = useState(null);
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setLandImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const data = new FormData();
        // Append all text fields from state
        data.append("plot_name", formData.plot_name);
        data.append("area_size", formData.area_size);
        data.append("soil_type", formData.soil_type);
        data.append("climate_zone", formData.climate_zone);
        data.append("region", formData.region);
        data.append("zone", formData.zone);
        data.append("woreda", formData.woreda);
        data.append("kebele", formData.kebele);

        // Append the image file
        if (landImage) {
            data.append("land_image", landImage);
        }

        try {
            // This route matches your server.js mount: app.use('/api/farmer/farm/land', landRoutes);
            const response = await api.post("/farmer/farm/land", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.success) {
                setMessage({ type: "success", text: "Land Assets successfully DROPPED into Registry!" });
                // Reset form
                setFormData({
                    plot_name: "",
                    area_size: "",
                    soil_type: "Nitosols",
                    climate_zone: "Weyna Dega",
                    region: "",
                    zone: "",
                    woreda: "",
                    kebele: ""
                });
                setLandImage(null);
                // Reset file input manually
                document.getElementById("land_image_input").value = "";
            }
        } catch (err) {
            console.error("Registry DROP Error:", err);
            const errorMsg = err.response?.data?.error || "Failed to sync with registry. Ensure Soils table is seeded.";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-land-container" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2e7d32', borderBottom: '2px solid #2e7d32', paddingBottom: '10px' }}>Register New Land Plot</h2>
            
            {message.text && (
                <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Plot Name</label>
                    <input 
                        type="text" 
                        name="plot_name" 
                        value={formData.plot_name} 
                        onChange={handleChange} 
                        required 
                        placeholder="e.g. North Field"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Area Size (Hectares)</label>
                        <input 
                            type="number" 
                            name="area_size" 
                            step="0.01" 
                            value={formData.area_size} 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Soil Type</label>
                        <select 
                            name="soil_type" 
                            value={formData.soil_type} 
                            onChange={handleChange} 
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="Nitosols">Nitosols</option>
                            <option value="Vertisols">Vertisols</option>
                            <option value="Cambisols">Cambisols</option>
                            <option value="Fluvisols">Fluvisols</option>
                            <option value="Leptosols">Leptosols</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Climate Zone</label>
                        <select 
                            name="climate_zone" 
                            value={formData.climate_zone} 
                            onChange={handleChange} 
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="Dega">Dega (Cold)</option>
                            <option value="Weyna Dega">Weyna Dega (Temperate)</option>
                            <option value="Kolla">Kolla (Warm)</option>
                            <option value="Bereha">Bereha (Hot/Desert)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Region</label>
                        <input 
                            type="text" 
                            name="region" 
                            value={formData.region} 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Zone</label>
                        <input type="text" name="zone" value={formData.zone} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Woreda</label>
                        <input type="text" name="woreda" value={formData.woreda} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Kebele</label>
                        <input type="text" name="kebele" value={formData.kebele} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Land Plot Image</label>
                    <input 
                        id="land_image_input"
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ marginTop: '5px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: loading ? '#9e9e9e' : '#2e7d32', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontSize: '16px', 
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? "Syncing with Registry..." : "DROP TO REGISTRY"}
                </button>
            </form>
        </div>
    );
};

export default AddLand;
