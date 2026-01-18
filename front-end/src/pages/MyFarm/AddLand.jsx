import React, { useState } from "react";
import api from "../../api"; // Your Axios instance

const AddLand = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        plot_name: "",
        area_size: "",
        soil_type: "Nitosols", 
        climate_zone: "Weyna Dega",
        region: "",
        zone: "",
        woreda: "",
        kebele: "",
    });
    const [landImage, setLandImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        // Append all text fields
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // Append Image file
        if (landImage) data.append("land_image", landImage);

        // Required to prevent 500 errors on registry sync
        data.append("crops", JSON.stringify([])); 
        data.append("animals", JSON.stringify([]));

        try {
            const response = await api.post("/farmer/farm/land", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                alert("Land Assets successfully DROPPED into Registry!");
                // Optional: Clear form
                setFormData({
                    plot_name: "", area_size: "", soil_type: "Nitosols",
                    climate_zone: "Weyna Dega", region: "", zone: "", woreda: "", kebele: ""
                });
            }
        } catch (err) {
            console.error("DROP Failed:", err);
            alert(err.response?.data?.error || "Internal Registry Error. Check if Soils table exists.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registry-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #2e7d32', paddingBottom: '10px' }}>Register New Land Plot</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <label>Plot Name</label>
                <input type="text" name="plot_name" value={formData.plot_name} required onChange={handleChange} />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Size (Hectares)</label>
                        <input type="number" name="area_size" step="0.01" required onChange={handleChange} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Soil Type</label>
                        <select name="soil_type" onChange={handleChange} style={{ width: '100%', padding: '5px' }}>
                            <option value="Nitosols">Nitosols</option>
                            <option value="Vertisols">Vertisols</option>
                            <option value="Cambisols">Cambisols</option>
                            <option value="Fluvisols">Fluvisols</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" name="region" placeholder="Region" required onChange={handleChange} />
                    <input type="text" name="zone" placeholder="Zone" required onChange={handleChange} />
                    <input type="text" name="woreda" placeholder="Woreda" required onChange={handleChange} />
                    <input type="text" name="kebele" placeholder="Kebele" required onChange={handleChange} />
                </div>

                <label>Upload Land Image</label>
                <input type="file" accept="image/*" onChange={(e) => setLandImage(e.target.files[0])} />

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        backgroundColor: '#2e7d32', 
                        color: 'white', 
                        padding: '10px', 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    {loading ? "Processing DROP..." : "DROP to Registry"}
                </button>
            </form>
        </div>
    );
};

export default AddLand;
