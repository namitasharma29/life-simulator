import React from 'react';
import { Award, Lock, Star, TrendingUp } from 'lucide-react';
import achievementStorage from '../utils/achievementStorage';

const Achievements = ({ achievements, achievementsList, unlockAchievement, styles, achievementTick }) => {
  // Get tier colors
  const getTierColor = (tierName) => {
    switch (tierName?.toLowerCase()) {
      case 'bronze':
        return {
          bg: '#cd7f32',
          light: '#d4956a',
          glow: 'rgba(205, 127, 50, 0.3)'
        };
      case 'silver':
        return {
          bg: '#c0c0c0',
          light: '#d3d3d3',
          glow: 'rgba(192, 192, 192, 0.3)'
        };
      case 'gold':
        return {
          bg: '#ffd700',
          light: '#ffe44d',
          glow: 'rgba(255, 215, 0, 0.4)'
        };
      default:
        return {
          bg: '#9ca3af',
          light: '#d1d5db',
          glow: 'rgba(156, 163, 175, 0.2)'
        };
    }
  };

  // Get tier icon
  const getTierIcon = (level, maxLevel) => {
    if (level === 0) return <Lock size={16} />;
    if (level === maxLevel) return '👑'; // Max level crown
    if (level === 1) return '🥉'; // Bronze
    if (level === 2) return '🥈'; // Silver
    if (level === 3) return '🥇'; // Gold
    return <Star size={16} />;
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>
        <Award size={20} color="#e11d48" />
        Achievements ({achievements.length}/{achievementsList.length})
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {achievementsList.map((achievement) => {
          const unlocked = achievements.includes(achievement.id);
          const hasTiers = achievementStorage.hasTiers(achievement.id);
          const progress = hasTiers ? achievementStorage.getProgress(achievement.id) : null;
          const tiers = hasTiers ? achievementStorage.getTiers(achievement.id) : [];
          const currentLevel = progress?.level || 0;
          const maxLevel = tiers.length;
          const isMaxLevel = currentLevel === maxLevel;
          const currentTier = currentLevel > 0 ? tiers[currentLevel - 1] : null;
          const nextTier = currentLevel < maxLevel ? tiers[currentLevel] : null;
          
          const tierColors = currentTier ? getTierColor(currentTier.name) : null;

          return (
            <div
              key={achievement.id}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: hasTiers && currentLevel > 0
                  ? `3px solid ${tierColors.bg}`
                  : unlocked 
                    ? '3px solid #fbcfe8' 
                    : '2px solid #e5e7eb',
                background: hasTiers && currentLevel > 0
                  ? `linear-gradient(135deg, ${tierColors.light}15 0%, ${tierColors.bg}10 100%)`
                  : unlocked 
                    ? 'linear-gradient(135deg, #fce7f3 0%, #fee2e2 100%)' 
                    : '#f9fafb',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: hasTiers && !isMaxLevel ? 'pointer' : 'default',
                boxShadow: hasTiers && currentLevel > 0 
                  ? `0 4px 12px ${tierColors.glow}`
                  : 'none'
              }}
              onClick={() => {
                // For testing: click to advance tier (remove in production)
                if (hasTiers && !isMaxLevel) {
                  unlockAchievement(achievement.id);
                }
              }}
              onMouseEnter={(e) => {
                if (hasTiers && !isMaxLevel) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${tierColors?.glow || 'rgba(0,0,0,0.1)'}`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = hasTiers && currentLevel > 0 
                  ? `0 4px 12px ${tierColors.glow}`
                  : 'none';
              }}
            >
              {/* Tier Shine Effect (only for tiered achievements with progress) */}
              {hasTiers && currentLevel > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${tierColors.light}40, transparent)`,
                    animation: 'shine 3s infinite',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  {achievement.name}
                </div>
                
                {/* Tier Badge */}
                {hasTiers && currentLevel > 0 && (
                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: tierColors.bg,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: `0 2px 8px ${tierColors.glow}`,
                      marginLeft: '8px'
                    }}
                  >
                    {getTierIcon(currentLevel, maxLevel)}
                    {currentTier.name}
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.4' }}>
                {achievement.desc}
              </div>

              {/* Tiered Progress */}
              {hasTiers ? (
                <div>
                  {/* Tier Progress Bar */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '11px', color: '#6b7280' }}>
                      <span style={{ fontWeight: '600' }}>Progress</span>
                      <span>Level {currentLevel}/{maxLevel}</span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      {/* Multi-tier gradient bar */}
                      <div
                        style={{
                          width: `${(currentLevel / maxLevel) * 100}%`,
                          height: '100%',
                          background: currentLevel === 0 
                            ? '#e5e7eb'
                            : currentLevel === 1 
                              ? 'linear-gradient(90deg, #cd7f32 0%, #d4956a 100%)'
                              : currentLevel === 2 
                                ? 'linear-gradient(90deg, #cd7f32 0%, #c0c0c0 100%)'
                                : 'linear-gradient(90deg, #cd7f32 0%, #c0c0c0 50%, #ffd700 100%)',
                          transition: 'width 0.5s ease',
                          boxShadow: currentLevel > 0 ? `inset 0 1px 2px rgba(0,0,0,0.1)` : 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Tier Milestones */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    {tiers.map((tier, idx) => {
                      const tierLevel = idx + 1;
                      const isUnlocked = currentLevel >= tierLevel;
                      const isCurrent = currentLevel === tierLevel - 1;
                      const colors = getTierColor(tier.name);

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1,
                            opacity: isUnlocked ? 1 : isCurrent ? 0.7 : 0.4
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: isUnlocked ? colors.bg : '#e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              marginBottom: '4px',
                              border: isCurrent ? `2px solid ${colors.bg}` : 'none',
                              boxShadow: isUnlocked ? `0 2px 8px ${colors.glow}` : 'none',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {isUnlocked ? getTierIcon(tierLevel, maxLevel) : <Lock size={14} color="#9ca3af" />}
                          </div>
                          <div style={{ fontSize: '9px', fontWeight: '600', color: isUnlocked ? colors.bg : '#9ca3af', textAlign: 'center' }}>
                            {tier.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Text */}
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      backgroundColor: isMaxLevel 
                        ? '#fef3c7' 
                        : currentLevel > 0 
                          ? tierColors.light + '20'
                          : '#f9fafb',
                      color: isMaxLevel 
                        ? '#92400e' 
                        : currentLevel > 0 
                          ? tierColors.bg
                          : '#6b7280'
                    }}
                  >
                    {isMaxLevel ? (
                      <span>👑 Max Level Reached! ✨</span>
                    ) : currentLevel === 0 ? (
                      <span>🔒 Start: {nextTier.name} (+{nextTier.xpReward} XP)</span>
                    ) : (
                      <span>
                        <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Next: {nextTier.name} (+{nextTier.xpReward} XP)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                // Non-tiered achievement (legacy)
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#e11d48',
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: unlocked ? '#fce7f3' : '#f9fafb'
                  }}
                >
                  {unlocked ? '✓ Unlocked!' : `+${achievement.xpReward} XP`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add CSS animation for shine effect */}
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Achievements;