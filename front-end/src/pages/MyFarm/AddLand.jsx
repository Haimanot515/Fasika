import React, { useState } from "react";
import api from "../../api"; // Your Axios instance
import { toast } from "react-toastify";

const AddLand = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        plot_name: "",
        area_size: "",
        soil_type: "Nitosols", // Matches the Registry Seed
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
        // Append Basic Fields
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // Append Image for 'FarmerListing' Bucket
        if (landImage) data.append("land_image", landImage);

        // Ensure assets are DROPPED as valid JSON strings to prevent 500 errors
        data.append("crops", JSON.stringify([])); 
        data.append("animals", JSON.stringify([]));

        try {
            const response = await api.post("/farmer/farm/land", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                toast.success("Land Assets DROPPED to Registry!");
                // Clear form or redirect
            }
        } catch (err) {
            console.error("DROP Failed:", err);
            toast.error(err.response?.data?.error || "Registry Sync Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registry-container">
            <h2>Add New Land Plot</h2>
            <form onSubmit={handleSubmit} className="land-form">
                <div className="form-group">
                    <label>Plot Name</label>
                    <input type="text" name="plot_name" required onChange={handleChange} />
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>Area Size (Hectares)</label>
                        <input type="number" name="area_size" step="0.01" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Soil Type</label>
                        <select name="soil_type" onChange={handleChange}>
                            <option value="Nitosols">Nitosols (Red Clay)</option>
                            <option value="Vertisols">Vertisols (Black Clay)</option>
                            <option value="Cambisols">Cambisols</option>
                            <option value="Fluvisols">Fluvisols</option>
                        </select>
                    </div>
                </div>

                <div className="location-grid">
                    <input type="text" name="region" placeholder="Region" required onChange={handleChange} />
                    <input type="text" name="zone" placeholder="Zone" required onChange={handleChange} />
                    <input type="text" name="woreda" placeholder="Woreda" required onChange={handleChange} />
                    <input type="text" name="kebele" placeholder="Kebele" required onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Land Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setLandImage(e.target.files[0])} />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Registering Assets..." : "DROP to Registry"}
                </button>
            </form>
        </div>
    );
};

export default AddLand;
