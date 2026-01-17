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
      fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
      borderTop: '1px solid #e1e8ed',
    },
    backToTop: {
      backgroundColor: '#f8f9fa',
      color: '#2d6a4f',
      padding: '12px 0',
      textAlign: 'center',
      fontSize: '0.85rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      borderBottom: '1px solid #f1f3f5',
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
      fontSize: '1rem',
      fontWeight: '700',
      marginBottom: '18px',
      textTransform: 'uppercase'
    },
    link: {
      display: 'block',
      color: '#495057',
      textDecoration: 'none',
      fontSize: '0.95rem',
      marginBottom: '10px',
    },
    socialIcon: {
      color: '#2d6a4f',
      fontSize: '1.5rem',
      marginRight: '15px',
      cursor: 'pointer'
    },
    bottomBar: {
      borderTop: '1px solid #f1f3f5',
      padding: '30px 20px',
      backgroundColor: '#fdfdfd'
    }
  };

  return (
    <footer style={s.footerWrapper}>
      <div style={s.backToTop} onClick={scrollToTop}>
        <FaArrowUp style={{ marginRight: '8px' }} /> BACK TO TOP
      </div>

      <div style={s.mainGrid}>
        <div>
          <div style={s.colTitle}>Farmer Registry</div>
          <p style={{ fontSize: '0.9rem', color: '#636e72', lineHeight: '1.6' }}>
            Empowering agricultural growth through digital identity and smart land management.
          </p>
          <div style={{ marginTop: '15px' }}>
            <FaFacebook style={s.socialIcon} />
            <FaTelegram style={s.socialIcon} />
            <FaWhatsapp style={s.socialIcon} />
            <FaYoutube style={s.socialIcon} />
          </div>
        </div>

        <div>
          <div style={s.colTitle}>Quick Links</div>
          <Link to="/dashboard" style={s.link}>Dashboard</Link>
          <Link to="/my-farm/land/view" style={s.link}>My Plots</Link>
          <Link to="/market/sales" style={s.link}>Marketplace</Link>
          <Link to="/weather" style={s.link}>Weather</Link>
        </div>

        <div>
          <div style={s.colTitle}>Support</div>
          <Link to="/support" style={s.link}>Help Center</Link>
          <span style={s.link}>Privacy Policy</span>
          <span style={s.link}>Terms of Service</span>
        </div>

        <div>
          <div style={s.colTitle}>Contact</div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '8px'}}>
            <FaPhoneAlt size={12}/> +251 900 000 000
          </div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '8px'}}>
            <FaEnvelope size={12}/> support@farmer.et
          </div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '8px'}}>
            <FaGlobe size={12}/> Ethiopia
          </div>
        </div>
      </div>

      <div style={s.bottomBar}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#1b4332' }}>
            <FaSeedling color="#40916c" size={20} />
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
