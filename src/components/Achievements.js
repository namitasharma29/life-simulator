import React from 'react';
import { Award, Lock, Star, TrendingUp } from 'lucide-react';


// Accept all needed data and helpers as props (no logic or storage imports)
const Achievements = ({
  achievements,
  achievementsList,
  styles,
  getTierInfo, // function: (achievementId) => { hasTiers, progress, tiers, currentLevel, maxLevel, currentTier, nextTier }
}) => {
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

  const getTierIcon = (level, maxLevel) => {
    if (level === 0) return <Lock size={16} />;
    if (level === maxLevel) return '\ud83d\udc51'; // Max level crown
    if (level === 1) return '\ud83e\udd49'; // Bronze
    if (level === 2) return '\ud83e\udd48'; // Silver
    if (level === 3) return '\ud83e\udd47'; // Gold
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
          // Get all tier/progress info from parent
          const tierInfo = getTierInfo ? getTierInfo(achievement.id) : {};
          const {
            hasTiers = false,
            progress = null,
            tiers = [],
            currentLevel = 0,
            maxLevel = 0,
            currentTier = null,
            nextTier = null,
            isMaxLevel = false,
            tierColors = null
          } = tierInfo;
          const _tierColors = currentTier ? getTierColor(currentTier.name) : null;
          // ...existing code for rendering each achievement card...
          // (Paste the rest of the card rendering logic here, unchanged)
          // ...
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