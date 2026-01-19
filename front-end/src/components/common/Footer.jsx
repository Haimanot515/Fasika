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
      position: 'relative',
      zIndex: 999, // ✅ Higher Z-Index to stay above backgrounds
      marginTop: 'auto'
    },
    backToTop: {
      width: '100%', // ✅ Full Width
      backgroundColor: '#2d6a4f', // ✅ Vibrant Green
      color: '#FFFFFF',
      padding: '20px 0', // ✅ Bigger Height
      textAlign: 'center',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: '900',
      border: 'none',
      letterSpacing: '2px',
      transition: 'background 0.3s ease'
    },
    mainGrid: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '80px 20px', // ✅ Increased Padding for bigger height
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '50px'
    },
    colTitle: {
      color: '#1b4332',
      fontSize: '1.2rem', // ✅ Bigger Font
      fontWeight: '800',
      marginBottom: '25px',
      textTransform: 'uppercase'
    },
    link: {
      display: 'block',
      color: '#495057',
      textDecoration: 'none',
      fontSize: '1.05rem', // ✅ Bigger Links
      marginBottom: '15px',
      transition: 'color 0.2s'
    },
    socialIcon: {
      color: '#2d6a4f',
      fontSize: '1.8rem', // ✅ Bigger Icons
      marginRight: '20px',
      cursor: 'pointer'
    },
    bottomBar: {
      borderTop: '1px solid #f1f3f5',
      padding: '40px 20px', // ✅ Bigger Bottom Bar
      backgroundColor: '#fdfdfd'
    }
  };

  return (
    <footer style={s.footerWrapper}>
      {/* ✅ Full Width Green Back to Top */}
      <div 
        style={s.backToTop} 
        onClick={scrollToTop}
        onMouseOver={(e) => e.target.style.backgroundColor = '#1b4332'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#2d6a4f'}
      >
        <FaArrowUp style={{ marginRight: '10px' }} /> BACK TO TOP
      </div>

      <div style={s.mainGrid}>
        <div>
          <div style={s.colTitle}>Farmer Registry</div>
          <p style={{ fontSize: '1rem', color: '#636e72', lineHeight: '1.8' }}>
            The leading digital platform for Ethiopian agriculture. 
            Managing land, livestock, and market access in one secure place.
          </p>
          <div style={{ marginTop: '25px' }}>
            <FaFacebook style={s.socialIcon} />
            <FaTelegram style={s.socialIcon} />
            <FaWhatsapp style={s.socialIcon} />
            <FaYoutube style={s.socialIcon} />
          </div>
        </div>

        <div>
          <div style={s.colTitle}>Platform Navigation</div>
          <Link to="/dashboard" style={s.link}>Central Dashboard</Link>
          <Link to="/my-farm/land/view" style={s.link}>Land Plot Management</Link>
          <Link to="/market/sales" style={s.link}>Marketplace Access</Link>
          <Link to="/weather" style={s.link}>Live Weather Sync</Link>
        </div>

        <div>
          <div style={s.colTitle}>Farmer Support</div>
          <Link to="/support" style={s.link}>Technical Help Desk</Link>
          <Link to="/advisory" style={s.link}>Agricultural Advisory</Link>
          <span style={s.link}>System Privacy Policy</span>
          <span style={s.link}>Terms of Cooperation</span>
        </div>

        <div>
          <div style={s.colTitle}>Official Contact</div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '12px'}}>
            <FaPhoneAlt size={16}/> +251 943257078
          </div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '12px'}}>
            <FaEnvelope size={16}/> registry-support@gov.et
          </div>
          <div style={{...s.link, display: 'flex', alignItems: 'center', gap: '12px', color: '#2d6a4f', fontWeight: 'bold'}}>
            <FaGlobe size={16}/> Addis Ababa, Ethiopia
          </div>
        </div>
      </div>

      <div style={s.bottomBar}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontWeight: '900', color: '#1b4332', fontSize: '1.4rem' }}>
            <FaSeedling color="#40916c" size={30} />
            <span> Fasika Farmers Connect, GRAND ETHIOPIAN FARMERS CENTER </span>
          </div>
          <div style={{ fontSize: '1rem', color: '#b2bec3', fontWeight: '600' }}>
            © 2018. SECURE AGRICULTURAL DATA SYSTEM.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
