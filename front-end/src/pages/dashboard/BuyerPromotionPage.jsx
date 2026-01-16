import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaArrowRight, FaGlobe, FaAward, FaTruckMoving, FaLeaf 
} from "react-icons/fa";
import { GiCoffeeBeans, GiSeedling } from "react-icons/gi";

const EditorialPromotion = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const collections = [
    { 
      id: "01", 
      name: "Harar Coffee", 
      detail: "Wild-grown, sun-dried, and deeply complex.",
      category: "Single Origin" 
    },
    { 
      id: "02", 
      name: "Organic Honey", 
      detail: "Sourced from the lush forests of Maji.",
      category: "Floral & Pure" 
    },
    { 
      id: "03", 
      name: "Highland Pulses", 
      detail: "Nutrient-dense lentils and chickpeas.",
      category: "Soil to Table" 
    },
  ];

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;700&display=swap');
        body { margin: 0; background: #ffffff !important; font-family: 'Inter', sans-serif; }
      `}</style>

      {/* 1. MINIMAL NAVIGATION */}
      <nav style={styles.nav}>
        <div style={styles.logo}>GEBEYA SELECT</div>
        <div style={styles.navLinks}>
          <span>Origin</span>
          <span>Traceability</span>
          <button style={styles.contactBtn}>Partner with us</button>
        </div>
      </nav>

      {/* 2. HERO SECTION - CLEAN & BOLD */}
      <section style={styles.hero}>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.heroTitle}
        >
          Ethiopia’s Finest <br /> 
          <span style={{color: '#c4a484'}}>Export Collection.</span>
        </motion.h1>
        
        <div style={styles.heroLayout}>
          <div style={styles.heroImageWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200" 
              alt="Premium Coffee" 
              style={styles.heroImg}
            />
          </div>
          <div style={styles.heroText}>
            <p style={styles.introPara}>
              Our marketplace utilizes a refined data architecture. 
              By implementing <b>DROP</b> schema protocols for real-time inventory 
              verification, we ensure that what you see is exactly what is in the warehouse.
            </p>
            <div style={styles.metricRow}>
              <div><FaAward color="#c4a484"/> Grade 1 Certified</div>
              <div><FaGlobe color="#c4a484"/> 100% Traceable</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VERTICAL LIST FEATURE (No Grids) */}
      <section style={styles.listSection}>
        <h2 style={styles.sectionHeading}>Current Availability</h2>
        <div style={styles.verticalList}>
          {collections.map((item, index) => (
            <motion.div 
              key={item.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={styles.listItem}
            >
              <div style={styles.itemMain}>
                <span style={styles.itemId}>{item.id}</span>
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemCategory}>{item.category}</p>
                </div>
              </div>
              <p style={{...styles.itemDetail, opacity: hoveredIndex === index ? 1 : 0}}>
                {item.detail}
              </p>
              <div style={styles.arrowIcon}>
                <FaArrowRight color={hoveredIndex === index ? "#000" : "#ccc"} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FOOTER FEATURE */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <FaLeaf size={30} color="#2d5a27" />
          <h2 style={{fontSize: '40px', fontWeight: '700'}}>Sustainably Grown.</h2>
          <p>Connecting the world to the cradle of humanity.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#ffffff", color: "#1a1a1a", minHeight: "100vh" },
  nav: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '30px 6%', borderBottom: '1px solid #f0f0f0' 
  },
  logo: { fontSize: '20px', fontWeight: '800', letterSpacing: '2px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '40px', fontSize: '14px', fontWeight: '600' },
  contactBtn: { 
    padding: '10px 20px', backgroundColor: '#1a1a1a', color: '#fff', 
    border: 'none', borderRadius: '4px', cursor: 'pointer' 
  },

  hero: { padding: '80px 6% 40px' },
  heroTitle: { 
    fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 8vw, 90px)', 
    lineHeight: '1.1', margin: '0 0 60px 0' 
  },
  heroLayout: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'flex-end' },
  heroImageWrapper: { height: '500px', overflow: 'hidden', borderRadius: '4px' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroText: { paddingBottom: '40px' },
  introPara: { fontSize: '18px', lineHeight: '1.8', color: '#555', marginBottom: '30px' },
  metricRow: { display: 'flex', gap: '30px', fontWeight: '700', fontSize: '14px' },

  listSection: { padding: '100px 6%' },
  sectionHeading: { fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px', color: '#999' },
  verticalList: { borderTop: '1px solid #eee' },
  listItem: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '40px 0', borderBottom: '1px solid #eee', cursor: 'pointer', transition: '0.3s' 
  },
  itemMain: { display: 'flex', alignItems: 'center', gap: '40px' },
  itemId: { fontSize: '14px', fontWeight: '700', color: '#c4a484' },
  itemName: { fontSize: '32px', fontWeight: '700', margin: 0 },
  itemCategory: { margin: '5px 0 0 0', color: '#999', fontSize: '14px' },
  itemDetail: { maxWidth: '300px', fontSize: '15px', color: '#666', transition: '0.5s' },
  arrowIcon: { fontSize: '20px' },

  footer: { padding: '100px 6%', textAlign: 'center', backgroundColor: '#fcfcfc' },
  footerInner: { maxWidth: '600px', margin: '0 auto' }
};

export default EditorialPromotion;
