import React from 'react';

const DailyQuests = ({ dailyQuests, completeQuest, styles }) => {
  const completedQuests = dailyQuests.filter(q => q.done).length;

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>
        🎯 Daily Quests ({completedQuests}/{dailyQuests.length})
      </h3>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
        New quests generate every day at midnight!
      </div>

      {dailyQuests.map((quest) => (
        <div
          key={quest.id}
          style={{ ...styles.questItem, ...(quest.done ? styles.questDone : {}) }}
        >
          <div>
            <div style={{ fontWeight: '600', color: '#374151' }}>{quest.text}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{quest.skill}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#e11d48', fontWeight: 'bold' }}>+{quest.xp} XP</span>
            <button
              onClick={() => completeQuest(quest.id)}
              disabled={quest.done}
              style={{
                ...styles.button,
                ...(quest.done
                  ? { background: '#d1fae5', color: '#065f46', cursor: 'default' }
                  : {}),
              }}
            >
              {quest.done ? '✓ Done' : 'Complete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyQuests;
