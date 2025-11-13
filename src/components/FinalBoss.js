import React from 'react';
import { Trophy } from 'lucide-react';

const FinalBoss = () => {
  const styles = {
    card: {
      background: 'linear-gradient(135deg, #e11d48 0%, #dc2626 100%)',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(225, 29, 72, 0.3)',
      padding: '32px',
      marginTop: '24px',
      color: 'white',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'default',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#fce7f3',
      marginBottom: '16px',
      fontSize: '16px',
    },
    encouragement: {
      fontSize: '18px',
      fontWeight: '600',
    },
  };

  // Little sparkle animation (optional)
  const handleHover = (e) => {
    e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow = '0 25px 50px rgba(225, 29, 72, 0.4)';
  };
  
  const handleLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 20px 40px rgba(225, 29, 72, 0.3)';
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <Trophy size={64} color="white" style={{ margin: '0 auto 16px' }} />
      <h2 style={styles.title}>👑 Final Boss: Data Scientist at Pinterest</h2>
      <p style={styles.subtitle}>
        Build analytical vision • Lead with communication • Innovate relentlessly • Strategize boldly
      </p>
      <p style={styles.encouragement}>
        Every XP point brings you closer to your ultimate goal ✨
      </p>
    </div>
  );
};

export default FinalBoss;
