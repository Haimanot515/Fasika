import React, { useState } from "react";
import api from "../../api/axios";
import { 
    ShieldCheck, Leaf, Ruler, Loader2, User, Search, MapPin, 
    PlusCircle, Trash2, Camera, Info, Save
} from "lucide-react";

const AdminAddLand = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [farmerProfile, setFarmerProfile] = useState(null);
  
  // Registry Node State
  const [formData, setFormData] = useState({
    plot_name: '', area_size: '', soil_type: '', climate_zone: '',
    region: '', zone: '', woreda: '', kebele: ''
  });
  const [landImage, setLandImage] = useState(null);
  const [crops, setCrops] = useState([{ crop_name: '', quantity: '' }]);

  // --- IDENTITY DISCOVERY ---
  const lookupFarmer = async () => {
    if (!searchTerm) return alert("ENTER IDENTITY KEY (Email/Phone/ID)");
    try {
      setLoading(true);
      const res = await api.get(`/admin/farmers/search?query=${searchTerm}`);
      if (res.data.success && res.data.data.length > 0) {
        setFarmerProfile(res.data.data[0]);
      } else {
        alert("IDENTITY NOT FOUND IN GLOBAL REGISTRY");
        setFarmerProfile(null);
      }
    } catch (err) {
      alert("REGISTRY SYNC FAILED");
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTRY DROP EXECUTION ---
  const handleDropRegistry = async (e) => {
    e.preventDefault();
    if (!farmerProfile) return;
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('crops', JSON.stringify(crops));
    if (landImage) data.append('image', landImage);

    try {
      setLoading(true);
      await api.post(`/admin/farmers/add-land/${farmerProfile.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("NODE SUCCESSFULLY DROPPED INTO REGISTRY");
      window.location.reload(); 
    } catch (err) {
      alert("AUTHORITY REJECTION: DROP FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.mainTitle}>ADD LAND REGISTRY</h1>
          <p style={styles.subTitle}>Registering New Asset Nodes to Global Authority</p>
        </div>
      </div>

      {/* PHASE 1: IDENTITY SEARCH */}
      <div style={styles.searchSection}>
        <div style={styles.sectionHeader}><Search size={18}/> 1. IDENTITY DISCOVERY</div>
        <div style={styles.searchWrapper}>
          <input 
            style={styles.searchInput}
            placeholder="Search by Email, Phone, or UUID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={lookupFarmer} style={styles.lookupBtn} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18}/> : "VERIFY IDENTITY"}
          </button>
        </div>
      </div>

      {/* FARMER PREVIEW BADGE */}
      {farmerProfile && (
        <div style={styles.farmerBadge}>
          <div style={styles.badgeAvatar}>
            <User size={24} color="#166534"/>
          </div>
          <div style={styles.badgeInfo}>
            <h3 style={{margin: 0}}>{farmerProfile.full_name?.toUpperCase()}</h3>
            <p style={{margin: 0, fontSize: '12px', color: '#64748b'}}>REG_ID: {farmerProfile.id} | {farmerProfile.email}</p>
          </div>
          <ShieldCheck color="#16a34a" size={24}/>
        </div>
      )}

      {/* PHASE 2: DATA INPUT */}
      <form onSubmit={handleDropRegistry} style={{...styles.form, opacity: farmerProfile ? 1 : 0.4}}>
        <div style={styles.sectionHeader}><Info size={18}/> 2. PLOT & SOIL CHARACTERISTICS</div>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PLOT NAME</label>
            <input required style={styles.input} onChange={e => setFormData({...formData, plot_name: e.target.value})} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>AREA SIZE (HA)</label>
            <input required type="number" style={styles.input} onChange={e => setFormData({...formData, area_size: e.target.value})} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>SOIL TYPE</label>
            <select required style={styles.input} onChange={e => setFormData({...formData, soil_type: e.target.value})}>
              <option value="">SELECT TYPE</option>
              <option value="Loamy">LOAMY</option>
              <option value="Clay">CLAY</option>
              <option value="Sandy">SANDY</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>LOCATION (REGION/ZONE)</label>
            <input style={styles.input} placeholder="E.g. Oromia, Arsi" onChange={e => setFormData({...formData, region: e.target.value})} />
          </div>
        </div>

        <div style={styles.sectionHeader}><Leaf size={18}/> 3. BIOLOGICAL ASSETS (CROPS)</div>
        {crops.map((crop, i) => (
          <div key={i} style={styles.assetRow}>
            <input placeholder="CROP NAME" style={styles.input} onChange={e => {
              let nc = [...crops]; nc[i].crop_name = e.target.value; setCrops(nc);
            }} />
            <input placeholder="QUANTITY" style={styles.input} onChange={e => {
              let nc = [...crops]; nc[i].quantity = e.target.value; setCrops(nc);
            }} />
            <button type="button" onClick={() => setCrops(crops.filter((_, idx) => idx !== i))} style={styles.removeBtn}><Trash2 size={16}/></button>
          </div>
        ))}
        <button type="button" onClick={() => setCrops([...crops, {crop_name: '', quantity: ''}])} style={styles.addBtn}><PlusCircle size={16}/> ADD CROP NODE</button>

        <div style={styles.sectionHeader}><Camera size={18}/> 4. DOCUMENTATION</div>
        <input type="file" style={styles.fileInput} onChange={e => setLandImage(e.target.files[0])} />

        <button type="submit" style={styles.submitBtn} disabled={loading || !farmerProfile}>
          {loading ? "EXECUTING REGISTRY DROP..." : "DROP NODE TO GLOBAL REGISTRY"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '120px 5% 60px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { marginBottom: '40px' },
  mainTitle: { fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0 },
  subTitle: { color: '#64748b', fontSize: '14px', margin: '5px 0 0' },
  searchSection: { background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: '20px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '900', color: '#166534', marginBottom: '15px', marginTop: '25px' },
  searchWrapper: { display: 'flex', gap: '10px' },
  searchInput: { flex: 1, padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' },
  lookupBtn: { background: '#0f172a', color: 'white', padding: '12px 25px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  farmerBadge: { background: '#f0fff4', border: '2px solid #16a34a', borderRadius: '18px', padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  badgeAvatar: { background: 'white', padding: '10px', borderRadius: '50%' },
  badgeInfo: { flex: 1 },
  form: { background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '10px', fontWeight: '900', color: '#64748b' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
  assetRow: { display: 'flex', gap: '10px', marginBottom: '10px' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px dashed #166534', color: '#166534', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  removeBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
  fileInput: { padding: '10px', border: '1px dashed #cbd5e1', width: '100%', borderRadius: '12px' },
  submitBtn: { width: '100%', marginTop: '40px', padding: '18px', background: '#166534', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px' }
};

export default AdminAddLand;
