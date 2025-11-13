import React from 'react';
import { Trophy } from 'lucide-react';

const LevelCard = ({ currentLevel, nextLevel, xp, progressToNext, styles }) => {
  return (
    <div style={styles.card}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>{currentLevel.phase}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Level {currentLevel.level}: {currentLevel.title}
          </h2>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>{currentLevel.goal}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#e11d48' }}>{xp} XP</div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>Total Experience</div>
        </div>
      </div>

      {/* Progress Bar */}
      {nextLevel && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            <span>Progress to Level {nextLevel.level}</span>
            <span>{Math.round(progressToNext)}%</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '16px' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #e11d48 0%, #dc2626 100%)',
                borderRadius: '9999px',
                width: `${progressToNext}%`,
                transition: 'width 0.5s ease'
              }}
            />
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
            {nextLevel.xpRequired - xp} XP until {nextLevel.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelCard;
