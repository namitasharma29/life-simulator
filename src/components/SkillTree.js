import React from 'react';
import { TrendingUp } from 'lucide-react';

const SkillTree = ({ skillPoints, styles, skillIcons, skillNames }) => {
  return (
    <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
        <TrendingUp size={20} color="#e11d48" />
        Skill Trees
        </h3>
        {Object.entries(skillPoints).map(([skill, points]) => (
        <div key={skill} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {skillIcons[skill]}
                <span style={{ fontWeight: '600', color: '#374151' }}>{skillNames[skill]}</span>
            </div>
            <span style={{ color: '#e11d48', fontWeight: 'bold' }}>{points} XP</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
            <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #f472b6 0%, #ef4444 100%)',
                borderRadius: '9999px',
                width: `${Math.min((points / 500) * 100, 100)}%`,
                transition: 'width 0.3s ease'
            }} />
            </div>
        </div>
        ))}
    </div>
  );
};

export default SkillTree;
