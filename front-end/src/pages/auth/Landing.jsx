import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    // Force reset body margins and hide body scroll to ensure true full-width
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    return () => { document.body.style.overflowX = 'auto'; };
  }, []);

  const styles = {
    wrapper: {
      height: '100vh',
      width: '100vw',
      overflowY: 'scroll',
      overflowX: 'hidden', 
      scrollSnapType: 'y mandatory',
      backgroundColor: '#022c22',
      fontFamily: "'Inter', sans-serif",
      margin: 0,
      padding: 0
    },
    section: {
      height: '100vh',
      width: '100vw', // Ensures section is exactly the window width
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      scrollSnapAlign: 'start',
      position: 'relative',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    },
    topNav: {
      position: 'fixed',
      top: '40px',
      right: '40px',
      display: 'flex',
      gap: '20px',
      zIndex: 1000
    },
    // PERFECT GREEN BUTTON
    accessBtn: {
      padding: '18px 45px',
      background: '#00ff88', 
      color: '#000',
      border: 'none',
      fontSize: '14px',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 0 30px rgba(0, 255, 136, 0.4), inset 0 0 10px rgba(255,255,255,0.5)',
      transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0% 30%)',
    },
    // PERFECT GOLDEN BUTTON
    registerBtn: {
      padding: '18px 45px',
      background: 'linear-gradient(135deg, #ffcc00 0%, #ff9900 100%)',
      color: '#000',
      border: 'none',
      fontSize: '15px',
      fontWeight: '1000',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 10px 40px rgba(255, 153, 0, 0.5)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    heroBackground: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle at center, #065f46 0%, #064e3b 40%, #022c22 100%)',
      zIndex: 0,
      width: '100%'
    },
    mainHeading: {
      fontSize: 'clamp(4rem, 15vw, 12rem)',
      fontWeight: '950',
      lineHeight: '0.8',
      margin: '0',
      textTransform: 'uppercase',
      letterSpacing: '-8px',
      color: '#ecfdf5',
      textShadow: '0 0 50px rgba(16, 185, 129, 0.4)'
    }
  };

  return (
    <div style={styles.wrapper}>
      <nav style={styles.topNav}>
        <button 
          style={styles.registerBtn} 
          onClick={() => navigate('/register')}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1) rotate(-2deg)';
            e.target.style.boxShadow = '0 20px 60px rgba(255, 153, 0, 0.8)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = '0 10px 40px rgba(255, 153, 0, 0.5)';
          }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>Registor Now</span>
          <div style={{
            position: 'absolute',
            top: 0, left: '-100%', width: '50%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            transform: 'skewX(-25deg)',
            animation: 'shimmer 3s infinite'
          }} />
        </button>
        
        <button 
          style={styles.accessBtn} 
          onClick={() => navigate('/login')}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05) translateY(-3px)';
            e.target.style.background = '#fff';
            e.target.style.boxShadow = '0 20px 50px rgba(0, 255, 136, 0.8)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1) translateY(0)';
            e.target.style.background = '#00ff88';
            e.target.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.4)';
          }}
        >
          Login
        </button>
      </nav>

      <section style={styles.section}>
        <div style={styles.heroBackground} />
        <main style={{ zIndex: 10, textAlign: 'center', opacity: active ? 1 : 0, transition: 'all 1s', width: '100%' }}>
          <span style={{ color: '#00ff88', letterSpacing: '15px', textTransform: 'uppercase', fontSize: '12px', fontWeight: '900', display: 'block', marginBottom: '20px' }}>
            Official Ethiopian Farmer Network
          </span>
          <h1 style={styles.mainHeading}>
            Fasika<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '2px #00ff88' }}>
              Connect
            </span>
          </h1>
          <p style={{ color: '#fff', opacity: 0.6, maxWidth: '600px', margin: '40px auto', fontSize: '18px', lineHeight: '1.6', padding: '0 20px' }}>
            The most powerful trading tool in the across the country. 
            Join 50,000+ farmers gaining direct market access today.
          </p>
          <div style={{ marginTop: '20px', color: '#ffcc00', fontSize: '14px', fontWeight: '900', animation: 'pulse 2s infinite' }}>
            ↑ NEW FARMERS CLICK "JOIN & SELL NOW"
          </div>
        </main>
      </section>

      <section style={{ ...styles.section, background: '#011a14', width: '100vw' }}>
        <h2 style={{ color: '#ecfdf5', fontSize: '6vw', fontWeight: '900', margin: 0 }}>
          Built for <span style={{ color: '#00ff88' }}>Growth.</span>
        </h2>
        <div style={{ marginTop: '40px', width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, #00ff88, transparent)', opacity: 0.3 }} />
      </section>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.4; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-5px); }
            100% { opacity: 0.4; transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { left: -100%; }
            30% { left: 150%; }
            100% { left: 150%; }
          }
          /* Custom scrollbar to match the theme */
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #022c22; }
          ::-webkit-scrollbar-thumb { background: #00ff88; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};

export default Landing;