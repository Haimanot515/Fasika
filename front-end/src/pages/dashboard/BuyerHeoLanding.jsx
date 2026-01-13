import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaTag, FaTruck, FaShieldAlt } from "react-icons/fa";

const BuyerHeroLanding = () => {
  return (
    <div style={heroStyles.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .hero-animate { animation: fadeIn 0.8s ease-out forwards; }
        .promo-card:hover { transform: translateY(-10px); transition: 0.3s; }
      `}</style>

      {/* Main Hero Section */}
      <div style={heroStyles.heroSection}>
        <div className="hero-animate" style={heroStyles.heroContent}>
          <h1 style={heroStyles.title}>Direct From <span style={{color: '#febd69'}}>Ethiopian</span> Farms</h1>
          <p style={heroStyles.subtitle}>Premium quality grains, vegetables, and livestock at wholesale prices.</p>
          <Link to="/marketplace" style={heroStyles.ctaButton}>
            Explore Marketplace <FaArrowRight style={{marginLeft: '10px'}} />
          </Link>
        </div>
      </div>

      {/* Feature Bar */}
      <div style={heroStyles.featureBar}>
        <div style={heroStyles.featureItem}><FaTruck color="#febd69" /> Fast Delivery to Addis</div>
        <div style={heroStyles.featureItem}><FaShieldAlt color="#febd69" /> Verified Suppliers Only</div>
        <div style={heroStyles.featureItem}><FaTag color="#febd69" /> Best Bulk Prices</div>
      </div>

      {/* Promotion Grid */}
      <div style={heroStyles.promoGrid}>
        <div className="promo-card" style={{...heroStyles.card, background: 'url("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80") center/cover'}}>
          <div style={heroStyles.cardOverlay}>
            <h3>Harvest Season Deals</h3>
            <p>Up to 20% off on Cereals</p>
            <Link to="/marketplace" style={heroStyles.smallCta}>Shop Now</Link>
          </div>
        </div>

        <div className="promo-card" style={{...heroStyles.card, background: 'url("https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80") center/cover'}}>
          <div style={heroStyles.cardOverlay}>
            <h3>Organic Vegetables</h3>
            <p>Freshly picked daily</p>
            <Link to="/marketplace" style={heroStyles.smallCta}>View All</Link>
          </div>
        </div>

        <div className="promo-card" style={{...heroStyles.card, background: 'url("https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80") center/cover'}}>
          <div style={heroStyles.cardOverlay}>
            <h3>Livestock Expo</h3>
            <p>Direct from Oromia & Afar</p>
            <Link to="/marketplace" style={heroStyles.smallCta}>Explore</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const heroStyles = {
  container: { width: "100vw", minHeight: "100vh", background: "#e2e5e9", overflowX: "hidden" },
  heroSection: { 
    height: "60vh", 
    background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80")', 
    backgroundSize: "cover", 
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#fff"
  },
  heroContent: { maxWidth: "800px", padding: "20px" },
  title: { fontSize: "52px", fontWeight: "900", marginBottom: "20px", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" },
  subtitle: { fontSize: "20px", marginBottom: "30px", opacity: 0.9 },
  ctaButton: { 
    padding: "15px 40px", 
    fontSize: "18px", 
    backgroundColor: "#febd69", 
    color: "#131921", 
    textDecoration: "none", 
    borderRadius: "30px", 
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
    transition: "0.3s"
  },
  featureBar: { 
    display: "flex", 
    justifyContent: "space-around", 
    padding: "20px", 
    background: "#131921", 
    color: "#fff",
    fontSize: "16px"
  },
  featureItem: { display: "flex", alignItems: "center", gap: "10px" },
  promoGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
    gap: "20px", 
    padding: "40px 20px" 
  },
  card: { height: "300px", borderRadius: "12px", overflow: "hidden", position: "relative" },
  cardOverlay: { 
    position: "absolute", 
    inset: 0, 
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", 
    padding: "20px", 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "flex-end", 
    color: "#fff" 
  },
  smallCta: { 
    color: "#febd69", 
    textDecoration: "none", 
    fontWeight: "bold", 
    marginTop: "10px", 
    fontSize: "14px",
    textTransform: "uppercase"
  }
};

export default BuyerHeroLanding;