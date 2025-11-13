import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Target, TrendingUp, BookOpen, Code, Briefcase, Users, Heart, Award, Calendar, CheckCircle } from 'lucide-react';

const PinterestGame = () => {
  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('mihikaGameData');
      if (saved) {
        const data = JSON.parse(saved);
        return {
          xp: data.xp || 0,
          achievements: data.achievements || [],
          skillPoints: data.skillPoints || { academic: 0, tech: 0, career: 0, networking: 0, balance: 0 }
        };
      }
    } catch (e) {
      console.log('No saved data found');
    }
    return {
      xp: 0,
      achievements: [],
      skillPoints: { academic: 0, tech: 0, career: 0, networking: 0, balance: 0 }
    };
  };

  const savedData = loadSavedData();
  const [xp, setXp] = useState(savedData.xp);
  const [achievements, setAchievements] = useState(savedData.achievements);
  const [skillPoints, setSkillPoints] = useState(savedData.skillPoints);
  const [dailyQuests, setDailyQuests] = useState([]);
  const [deadlines, setDeadlines] = useState([
    { id: 1, text: 'MA 279 HW', due: 'Monday', done: false },
    { id: 2, text: 'MA 303 Quiz prep', due: 'Friday', done: false },
    { id: 3, text: 'CS 314 HW', due: 'Sunday', done: false },
    { id: 4, text: 'STAT 416 HW', due: 'Friday', done: false },
    { id: 5, text: 'ECON 340 HW', due: 'Friday', done: false }
  ]);

  const levels = [
    { level: 1, title: "The Analyst Apprentice", phase: "🧩 Foundation", goal: "Build GPA, core math/stats base", xpRequired: 0 },
    { level: 2, title: "Data Alchemist", phase: "🧠 Growth", goal: "Strengthen DS + coding + intuition", xpRequired: 500 },
    { level: 3, title: "Internship Seeker", phase: "💼 Launch", goal: "Land data-related internship", xpRequired: 1000 },
    { level: 4, title: "Pinterest Pathfinder", phase: "🚀 Career Entry", goal: "Secure DS role / grad school offer", xpRequired: 1500 },
    { level: 5, title: "Product Strategist", phase: "🏢 Leadership", goal: "Transition to management & strategy", xpRequired: 2000 },
    { level: 6, title: "Visionary of Pinterest", phase: "👑 CEO", goal: "Build, lead, inspire", xpRequired: 2500 }
  ];

  const achievementsList = [
    { id: 'math-slayer', name: '🥇 Math Slayer', desc: 'Get an A on a math exam', xpReward: 50 },
    { id: 'code-whisperer', name: '🧠 Code Whisperer', desc: 'Finish 3 Python/SQL practice days in a week', xpReward: 40 },
    { id: 'quant-queen', name: '📈 Quant Queen', desc: 'Complete a DS project with visualization', xpReward: 75 },
    { id: 'master-planner', name: '📜 Master Planner', desc: 'Stick to schedule for 7 straight days', xpReward: 30 },
    { id: 'internship-hunter', name: '💼 Internship Hunter', desc: 'Apply to 10+ internships', xpReward: 50 },
    { id: 'researcher-rising', name: '🧪 Researcher Rising', desc: 'Contribute in 3 research meetings', xpReward: 50 },
    { id: 'connector', name: '💬 The Connector', desc: 'Reach out to 3 new people on LinkedIn', xpReward: 25 },
    { id: 'focus-master', name: '🧘 Focus Master', desc: 'No procrastination streak (3 days)', xpReward: 30 },
    { id: '4plus1', name: '🎓 4+1 Candidate', desc: 'Get confirmation of eligibility', xpReward: 100 },
    { id: 'pinterest-path', name: '🏆 Pinterest Pathfounder', desc: 'Land first data science internship', xpReward: 200 }
  ];

  const questPools = {
    courses: [
      { text: 'Watch 1 MA 303 lecture video', xp: 8, skill: 'academic' },
      { text: 'Do 1 MA 279 problem', xp: 6, skill: 'academic' },
      { text: 'Complete 1 STAT 416 exercise', xp: 8, skill: 'academic' },
      { text: 'Read 1 week of ECON 340 slides', xp: 6, skill: 'academic' },
      { text: 'Watch 1 CS 314 lecture video', xp: 8, skill: 'tech' }
    ],
    data_ml: [
      { text: 'Do 30 mins Python pandas practice', xp: 10, skill: 'tech' },
      { text: 'Implement a small ML simulation', xp: 15, skill: 'tech' },
      { text: 'Solve 1 SQL window function problem', xp: 12, skill: 'tech' },
      { text: 'Train a logistic regression model', xp: 15, skill: 'tech' }
    ],
    research: [
      { text: 'Read a Pinterest engineering blog post', xp: 12, skill: 'career' },
      { text: 'Read a recsys paper (30-45 min)', xp: 15, skill: 'academic' },
      { text: 'Summarize a paper in 200 words', xp: 10, skill: 'academic' }
    ],
    life_balance: [
      { text: 'Plan your week (15 min)', xp: 5, skill: 'balance' },
      { text: 'Take a 20-min walk', xp: 5, skill: 'balance' },
      { text: 'Meditate 10 minutes', xp: 5, skill: 'balance' }
    ],
    career: [
      { text: 'Apply to 1 internship', xp: 10, skill: 'career' },
      { text: 'Update LinkedIn profile', xp: 8, skill: 'networking' },
      { text: 'Reach out to 1 person on LinkedIn', xp: 10, skill: 'networking' },
      { text: 'Attend a networking event', xp: 15, skill: 'networking' }
    ]
  };

  // Generate daily quests
  const generateDailyQuests = () => {
    const today = new Date().toDateString();
    const savedQuests = localStorage.getItem('dailyQuests');
    const savedDate = localStorage.getItem('questDate');
    
    if (savedQuests && savedDate === today) {
      return JSON.parse(savedQuests);
    }
    
    // Generate 5 random quests
    const allQuests = Object.values(questPools).flat();
    const selected = [];
    const usedIndices = new Set();
    
    while (selected.length < 5 && selected.length < allQuests.length) {
      const idx = Math.floor(Math.random() * allQuests.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        selected.push({ ...allQuests[idx], id: idx, done: false });
      }
    }
    
    localStorage.setItem('dailyQuests', JSON.stringify(selected));
    localStorage.setItem('questDate', today);
    return selected;
  };

  // Initialize daily quests
  useEffect(() => {
    setDailyQuests(generateDailyQuests());
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      xp,
      achievements,
      skillPoints
    };
    localStorage.setItem('mihikaGameData', JSON.stringify(dataToSave));
  }, [xp, achievements, skillPoints]);

  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].xpRequired) {
        return levels[i];
      }
    }
    return levels[0];
  };

  const getNextLevel = () => {
    const current = getCurrentLevel();
    const nextIndex = levels.findIndex(l => l.level === current.level) + 1;
    return nextIndex < levels.length ? levels[nextIndex] : null;
  };

  const addXP = (amount, skill) => {
    const oldLevel = getCurrentLevel();
    const newXP = xp + amount;
    setXp(newXP);
    
    if (skill) {
      setSkillPoints(prev => ({
        ...prev,
        [skill]: prev[skill] + amount
      }));
    }

    // Check for level up
    const newLevel = levels.find(l => newXP >= l.xpRequired && xp < l.xpRequired);
    if (newLevel) {
      // Celebrate level up!
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const completeQuest = (questId) => {
    const quest = dailyQuests.find(q => q.id === questId);
    if (quest && !quest.done) {
      addXP(quest.xp, quest.skill);
      const updatedQuests = dailyQuests.map(q => 
        q.id === questId ? { ...q, done: true } : q
      );
      setDailyQuests(updatedQuests);
      localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
    }
  };

  const toggleDeadline = (id) => {
    const deadline = deadlines.find(d => d.id === id);
    if (deadline && !deadline.done) {
      addXP(8, 'academic');
    }
    setDeadlines(deadlines.map(d => 
      d.id === id ? { ...d, done: !d.done } : d
    ));
  };

  const addDeadline = () => {
    const text = prompt('Enter deadline (e.g., "STAT 416 HW - Tuesday")');
    if (text) {
      const newDeadline = {
        id: Date.now(),
        text: text,
        due: 'TBD',
        done: false
      };
      setDeadlines([...deadlines, newDeadline]);
    }
  };

  const unlockAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      const achievement = achievementsList.find(a => a.id === achievementId);
      setAchievements(prev => [...prev, achievementId]);
      addXP(achievement.xpReward);
      confetti({
        particleCount: 100,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel ? ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100 : 100;

  const skillNames = {
    academic: 'Academic Mastery',
    tech: 'Data Science/Tech',
    career: 'Career & Strategy',
    networking: 'Networking',
    balance: 'Balance & Mindset'
  };

  const skillIcons = {
    academic: <BookOpen size={16} />,
    tech: <Code size={16} />,
    career: <Briefcase size={16} />,
    networking: <Users size={16} />,
    balance: <Heart size={16} />
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3f3 0%, #fef2f2 50%, #fff5f0 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '48px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #e11d48 0%, #dc2626 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '18px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '24px',
      marginBottom: '24px',
      border: '3px solid #fbcfe8'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    questItem: {
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'white'
    },
    questDone: {
      background: '#ecfdf5',
      opacity: 0.7
    },
    button: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      background: '#fce7f3',
      color: '#be185d',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 350px',
      gap: '24px'
    }
  };

  const completedQuests = dailyQuests.filter(q => q.done).length;

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎮 Mission Pinterest: The Mihika Saga</h1>
          <p style={styles.subtitle}>Your journey to CEO of Pinterest ✨</p>
        </div>

        {/* Current Level Card */}
        <div style={styles.card}>
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

          {nextLevel && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                <span>Progress to Level {nextLevel.level}</span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '16px' }}>
                <div style={{ 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #e11d48 0%, #dc2626 100%)',
                  borderRadius: '9999px',
                  width: `${progressToNext}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                {nextLevel.xpRequired - xp} XP until {nextLevel.title}
              </div>
            </div>
          )}
        </div>

        <div style={styles.grid}>
          {/* Main Content */}
          <div>
            {/* Daily Quests */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>
                <Target size={20} color="#e11d48" />
                🎯 Daily Quests ({completedQuests}/{dailyQuests.length})
              </h3>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                New quests generate every day at midnight!
              </div>
              {dailyQuests.map(quest => (
                <div key={quest.id} style={{...styles.questItem, ...(quest.done ? styles.questDone : {})}}>
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
                        ...(quest.done ? { background: '#d1fae5', color: '#065f46', cursor: 'default' } : {})
                      }}
                    >
                      {quest.done ? '✓ Done' : 'Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Skill Trees */}
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

            {/* Achievements */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>
                <Award size={20} color="#e11d48" />
                Achievements ({achievements.length}/{achievementsList.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
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
                        background: unlocked ? 'linear-gradient(135deg, #fce7f3 0%, #fee2e2 100%)' : '#f9fafb',
                        cursor: unlocked ? 'default' : 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{achievement.name}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{achievement.desc}</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#e11d48' }}>
                        {unlocked ? '✓ Unlocked!' : `+${achievement.xpReward} XP`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Weekly Planner */}
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

            {/* Journey Roadmap */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>
                <Star size={20} color="#e11d48" />
                Your Journey to CEO
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
          </div>
        </div>

        {/* Final Boss */}
        <div style={{
          background: 'linear-gradient(135deg, #e11d48 0%, #dc2626 100%)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(225, 29, 72, 0.3)',
          padding: '32px',
          marginTop: '24px',
          color: 'white',
          textAlign: 'center'
        }}>
          <Trophy size={64} color="white" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>👑 Final Boss: CEO of Pinterest</h2>
          <p style={{ color: '#fce7f3', marginBottom: '16px' }}>
            Build analytical vision • Lead with communication • Innovate relentlessly • Strategize boldly
          </p>
          <p style={{ fontSize: '18px', fontWeight: '600' }}>
            Every XP point brings you closer to your ultimate goal ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default PinterestGame;