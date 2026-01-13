import React, { useState } from 'react';

const ResendCode = () => {
  const [message, setMessage] = useState('');

  const handleResend = () => {
    // Simulate sending code
    setMessage('✅ New code sent to your email!');
    setTimeout(() => setMessage(''), 4000); // clear message after 4s
  };

  return (
    <div style={{ fontSize: '0.95rem', textAlign: 'center', marginTop: '15px' }}>
      <p style={{ margin: 0 }}>
        Didn't get a code?{' '}
        <span
          onClick={handleResend}
          style={{
            color: '#27ae60',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.color = '#2ecc71')}
          onMouseOut={(e) => (e.target.style.color = '#27ae60')}
        >
          Resend Code
        </span>
      </p>
      {message && (
        <p
          style={{
            marginTop: '8px',
            color: '#27ae60',
            fontSize: '0.9rem',
            transition: 'opacity 0.5s',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ResendCode;
