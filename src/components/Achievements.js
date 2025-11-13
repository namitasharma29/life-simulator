import React from 'react';
import { Award } from 'lucide-react';

const Achievements = ({ achievements, achievementsList, unlockAchievement, styles }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>
        <Award size={20} color="#e11d48" />
        Achievements ({achievements.length}/{achievementsList.length})
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        {achievementsList.map((achievement) => {
          const unlocked = achievements.includes(achievement.id);
          return (
            <button
              key={achievement.id}
              onClick={() => unlockAchievement(achievement.id)}
              disabled={unlocked}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: `2px solid ${unlocked ? '#fbcfe8' : '#e5e7eb'}`,
                background: unlocked
                  ? 'linear-gradient(135deg, #fce7f3 0%, #fee2e2 100%)'
                  : '#f9fafb',
                cursor: unlocked ? 'default' : 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginBottom: '4px',
                }}
              >
                {achievement.name}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '8px',
                }}
              >
                {achievement.desc}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#e11d48',
                }}
              >
                {unlocked ? '✓ Unlocked!' : `+${achievement.xpReward} XP`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
