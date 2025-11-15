import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import achievementStorage from '../utils/achievementStorage';

const TIER_COLORS = ['#e5e7eb', '#b7791f', '#9ca3af', '#f59e0b']; // index by level

const Achievements = ({ achievements, achievementsList, unlockAchievement, styles, achievementTick }) => {
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    // Refresh local view of tier progress when achievements or external tick changes
    const map = {};
    achievementsList.forEach(a => {
      if (achievementStorage.hasTiers(a.id)) {
        map[a.id] = achievementStorage.getProgress(a.id) || { level: 0 };
      }
    });
    setProgressMap(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievements, achievementTick]);

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>
        <Award size={20} color="#e11d48" />
        Achievements ({achievements.length}/{achievementsList.length})
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        {achievementsList.map((achievement) => {
          const unlocked = achievements.includes(achievement.id);
          const isTiered = achievementStorage.hasTiers(achievement.id);
          const prog = progressMap[achievement.id] || { level: 0 };
          const level = prog.level || 0;
          const tierLabel = isTiered ? (achievementStorage.getTiers(achievement.id)[Math.max(0, level - 1)]?.name || 'Unranked') : null;

          const borderColor = isTiered ? TIER_COLORS[level] : (unlocked ? '#fbcfe8' : '#e5e7eb');
          const background = isTiered ? (level > 0 ? `linear-gradient(135deg, ${TIER_COLORS[level]}33 0%, ${TIER_COLORS[level]}22 100%)` : '#f9fafb') : (unlocked ? 'linear-gradient(135deg, #fce7f3 0%, #fee2e2 100%)' : '#f9fafb');

          return (
            <div
              key={achievement.id}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: `2px solid ${borderColor}`,
                background,
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{achievement.name}</div>
                  {isTiered && (
                    <div style={{ fontSize: '12px', fontWeight: '700', color: level > 0 ? '#111827' : '#6b7280', background: '#ffffff88', padding: '6px 8px', borderRadius: '999px', border: `1px solid ${borderColor}` }}>
                      {level > 0 ? `${tierLabel}` : 'Unranked'}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>{achievement.desc}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#e11d48' }}>
                  {isTiered ? (level > 0 ? `Level ${level} • ${tierLabel}` : `Tiered • Next: ${achievementStorage.getTiers(achievement.id)[0].name}`) : (unlocked ? '✓ Unlocked!' : `+${achievement.xpReward} XP`)}
                </div>

                <button
                  onClick={() => unlockAchievement(achievement.id)}
                  disabled={isTiered && (achievementStorage.getTiers(achievement.id).length <= level)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isTiered ? (level > 0 ? '#111827' : '#8b5cf6') : (unlocked ? '#9ca3af' : '#8b5cf6'),
                    color: 'white',
                    cursor: (isTiered && (achievementStorage.getTiers(achievement.id).length <= level)) ? 'default' : 'pointer',
                    fontWeight: '700'
                  }}
                >
                  {isTiered ? (level > 0 ? (achievementStorage.getTiers(achievement.id).length > level ? 'Next Level' : 'Maxed') : 'Start') : (unlocked ? 'Unlocked' : 'Unlock')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
