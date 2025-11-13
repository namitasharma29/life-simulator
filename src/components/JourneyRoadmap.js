import React from 'react';
import { Star } from 'lucide-react';

const JourneyRoadmap = ({ levels, xp, currentLevel, styles }) => {
  return (
    <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
        <Star size={20} color="#e11d48" />
        Your Journey to Data Scientist
        </h3>
        {levels.map((level) => {
          const isComplete = xp >= level.xpRequired;
          const isCurrent = currentLevel.level === level.level;
        return (
            <div
            key={level.level}
            style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                border: `2px solid ${isCurrent ? '#f472b6' : isComplete ? '#86efac' : '#e5e7eb'}`,
                background: isCurrent ? 'linear-gradient(90deg, #fce7f3 0%, #fee2e2 100%)' : isComplete ? '#ecfdf5' : '#f9fafb'
            }}
            >
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{level.level}. {level.title}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{level.phase}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{level.xpRequired} XP</div>
            </div>
        );
        })}
    </div>
  );
};

export default JourneyRoadmap;
