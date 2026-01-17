import React from 'react';
import { Link } from 'react-router-dom';
// ✅ Split imports: Fa6 for specific new icons, Fa for standard ones
import { 
  FaFacebook, FaTelegram, FaWhatsapp, FaYoutube, 
  FaGlobe, FaArrowUp, FaSeedling, FaPhoneAlt, FaEnvelope 
} from 'react-icons/fa'; 
import { 
  FaUserShield, FaCow, FaWheatAwn, FaMapLocationDot 
} from 'react-icons/fa6'; 

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const s = {
    footerWrapper: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      color: '#2d3436',
      fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
      borderTop: '2px solid #e1e8ed',
      position: 'relative',
      zIndex: 9999, 
      marginTop: 'auto'
    },
    backToTop: {
      width: '100%', 
      backgroundColor: '#2d6a4f', 
      color: '#FFFFFF',
      padding: '25px 0',
      textAlign: 'center',
      fontSize: '1.1rem',
      cursor: 'pointer',
      fontWeight: '900',
      border: 'none',
      letterSpacing: '3px',
      transition: 'background 0.3s ease',
      textTransform: 'uppercase'
    },
    mainGrid: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '100px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px'
    },
    colTitle: {
      color: '#1b4332',
      fontSize: '1.1rem',
      fontWeight: '800',
      marginBottom: '30px',
      textTransform: 'uppercase',
      borderLeft: '4px solid #40916c',
      paddingLeft: '12px'
    },
    link: {
      display: 'block',
      color: '#495057',
      textDecoration: 'none',
      fontSize: '1rem',
      marginBottom: '18px',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    socialIcon: {
      color: '#2d6a4f',
      fontSize: '1.8rem',
      marginRight: '20px',
      cursor: 'pointer'
    },
    bottomBar: {
      borderTop: '1px solid #f1f3f5',
      padding: '50px 20px',
      backgroundColor: '#fdfdfd'
    }
  };

  return (
    <footer style={s.footerWrapper}>
      <div 
        style={s.backToTop} 
        onClick={scrollToTop}
        onMouseOver={(e) => e.target.style.backgroundColor = '#1b4332'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#2d6a4f'}
      >
        <FaArrowUp style={{ marginRight: '10px' }} /> RETURN TO TOP
      </div>

      <div style={s.mainGrid}>
        {/* COL 1: MISSION */}
        <div>
          <div style={s.colTitle}>Our Mission</div>
          <p style={{ fontSize: '1rem', color: '#636e72', lineHeight: '1.8', marginBottom: '25px' }}>
            Securing the future of Ethiopian farming through data integrity and 
            sustainable resource management for every kebele.
          </p>
          <div style={{ display: 'flex' }}>
            <FaFacebook style={s.socialIcon} />
            <FaTelegram style={s.socialIcon} />
            <FaWhatsapp style={s.socialIcon} />
          </div>
        </div>

        {/* COL 2: EXPERT TEAMS */}
        <div>
          <div style={s.colTitle}>Expert Teams</div>
          <span style={s.link}><FaWheatAwn /> Crop Specialists</span>
          <span style={s.link}><FaCow /> Livestock Health</span>
          <span style={s.link}><FaUserShield /> Land Legal Team</span>
          <span style={s.link}><FaGlobe /> Soil Analytics</span>
        </div>

        {/* COL 3: REGIONAL HUBS */}
        <div>
          <div style={s.colTitle}>Regional Hubs</div>
          <span style={s.link}>Oromia Regional Office</span>
          <span style={s.link}>Amhara Data Center</span>
          <span style={s.link}>Sidama Support</span>
          <span style={s.link}>Tigray Farm Hub</span>
        </div>

        {/* COL 4: FARMER TOOLS */}
        <div>
          <div style={s.colTitle}>Farmer Tools</div>
          <Link to="/my-farm/land/add" style={s.link}>Register New Plot</Link>
          <Link to="/market/sales/add-listing" style={s.link}>Post Market Sale</Link>
          <Link to="/weather" style={s.link}>Regional Weather</Link>
          <Link to="/notifications" style={s.link}>System Alerts</Link>
        </div>

        {/* COL 5: GOVERNANCE */}
        <div>
          <div style={s.colTitle}>Governance</div>
          <Link to="/advisory" style={s.link}>Advisory Board</Link>
          <span style={s.link}>Registry Standards</span>
          <span style={s.link}>Usage Statistics</span>
          <span style={s.link}>Public ID Search</span>
        </div>

        {/* COL 6: DIRECT CONTACT */}
        <div>
          <div style={s.colTitle}>Official Support</div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaPhoneAlt size={14}/> +251 911 00 00
          </div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaEnvelope size={14}/> registry@gov.et
          </div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaMapLocationDot size={14}/> Addis Ababa
          </div>
        </div>
      </div>

      <div style={s.bottomBar}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontWeight: '900', color: '#1b4332', fontSize: '1.6rem' }}>
            <FaSeedling color="#40916c" size={35} />
            <span>ETHIOPIAN FARMER REGISTRY</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', color: '#2d3436', fontWeight: '700' }}>Ministry of Agriculture & Livestock</div>
            <div style={{ fontSize: '0.85rem', color: '#b2bec3' }}>© 2026 National Database. Secure Encryption Active.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
