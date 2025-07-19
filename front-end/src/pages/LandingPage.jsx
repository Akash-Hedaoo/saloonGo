import React from 'react';


const LandingPage = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#a500a0ff', marginBottom: '1rem' }}>Welcome to SaloonGo</h1>
      <p style={{ fontSize: '1.2rem', color: '#333', maxWidth: 600, textAlign: 'center' }}>
        Discover and book the best salons near you. Enjoy easy appointment booking, real-time crowd updates, and more!
      </p>
    </div>
  );
};

export default LandingPage;
