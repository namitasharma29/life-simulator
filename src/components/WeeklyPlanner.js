import React from 'react';
import { Calendar } from 'lucide-react';

const WeeklyPlanner = ({ deadlines, toggleDeadline, addDeadline, styles }) => {
  return (
    <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
        <Calendar size={20} color="#e11d48" />
        📚 This Week's Deadlines
        </h3>
        {deadlines.map(deadline => (
        <div key={deadline.id} style={{...styles.questItem, ...(deadline.done ? styles.questDone : {})}}>
            <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#374151' }}>{deadline.text}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Due: {deadline.due}</div>
            </div>
            <button 
            onClick={() => toggleDeadline(deadline.id)}
            style={{
                ...styles.button,
                fontSize: '12px',
                padding: '6px 12px',
                ...(deadline.done ? { background: '#d1fae5', color: '#065f46' } : {})
            }}
            >
            {deadline.done ? '✓' : 'Done'}
            </button>
        </div>
        ))}
        <button onClick={addDeadline} style={{...styles.button, width: '100%', marginTop: '8px'}}>
        + Add Deadline
        </button>
    </div>
  );
};

export default WeeklyPlanner;
