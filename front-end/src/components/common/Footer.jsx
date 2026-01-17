import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaTelegram, FaWhatsapp, FaYoutube, 
  FaGlobe, FaArrowUp, FaSeedling, FaPhoneAlt, FaEnvelope 
} from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const s = {
    footerWrapper: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      color: '#2d3436',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      borderTop: '1px solid #e1e8ed'
    },
    backToTop: {
      backgroundColor: '#f8f9fa',
      color: '#2d6a4f',
      padding: '12px 0',
      textAlign: 'center',
      fontSize: '0.9rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      borderBottom: '1px solid #f1f3f5',
      transition: 'all 0.2s ease'
    },
    mainGrid: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '50px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '40px'
    },
    colTitle: {
      color: '#1b4332',
      fontSize: '1.1rem',
      fontWeight: '700',
      marginBottom: '18px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    link: {
      display: 'block',
      color: '#495057',
      textDecoration: 'none',
      fontSize: '0.95rem',
      marginBottom: '10px',
      transition: 'color 0.2s'
    },
    iconGroup: {
      display: 'flex',
      gap: '20px',
      fontSize: '1.4rem',
      marginTop: '15px'
    },
    socialIcon: {
      color: '#2d6a4f',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    bottomBar: {
      borderTop: '1px solid #f1f3f5',
      padding: '30px 20px',
      backgroundColor: '#fdfdfd'
    },
    bottomContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    }
  };

  return (
    <footer style={s.footerWrapper}>
      {/* Amazon-style Top Bar */}
      <div style={s.backToTop} onClick={scrollToTop}>
        <FaArrowUp style={{ marginRight: '8px' }} /> BACK TO TOP
      </div>

      <div style={s.mainGrid}>
        {/* Column 1: Registry Info */}
        <div>
          <div style={s.colTitle}>Farmer Registry</div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#636e72' }}>
            Empowering agricultural growth through digital identity and 
            smart land management systems.
          </p>
          <div style={s.iconGroup}>
            <FaFacebook style={s.socialIcon} />
            <FaTelegram style={s.socialIcon} />
            <FaWhatsapp style={s.socialIcon} />
            <FaYoutube style={s.socialIcon} />
          </div>
        </div>

        {/* Column 2: Farmer Services */}
        <div>
          <div style={s.colTitle}>Services</div>
          <Link to="/my-farm/land/view" style={s.link}>My Land Plots</Link>
          <Link to="/market/sales" style={s.link}>Marketplace</Link>
          <Link to="/weather" style={s.link}>Weather Forecast</Link>
          <Link to="/advisory" style={s.link}>Advisory Board</Link>
        </div>

        {/* Column 3: Help & Support */}
        <div>
          <div style={s.colTitle}>Support</div>
          <Link to="/support" style={s.link}>Help Center</Link>
          <span style={s.link}>Registry Guidelines</span>
          <span style={s.link}>Privacy Policy</span>
          <span style={s.link}>Terms of Service</span>
        </div>

        {/* Column 4: Contact */}
        <div>
          <div style={s.colTitle}>Contact Us</div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaPhoneAlt size={14}/> +251 900 000 000
          </div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaEnvelope size={14}/> support@farmerregistry.et
          </div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaGlobe size={14}/> Addis Ababa, Ethiopia
          </div>
        </div>
      </div>

      <div style={s.bottomBar}>
        <div style={s.bottomContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#1b4332' }}>
            <FaSeedling color="#40916c" size={24} />
            <span>ETHIOPIAN FARMER REGISTRY</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#b2bec3' }}>
            © 2026. All Rights Reserved. 
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
