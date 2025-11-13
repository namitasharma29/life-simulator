// src/App.js  (or src/PinterestGame.jsx if that's your entry)
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, Code, Briefcase, Users, Heart} from 'lucide-react';

import LevelCard from './components/LevelCard';
import DailyQuests from './components/DailyQuests';
import SkillTree from './components/SkillTree';
import Achievements from './components/Achievements';
import WeeklyPlanner from './components/WeeklyPlanner';
import JourneyRoadmap from './components/JourneyRoadmap';
import FinalBoss from './components/FinalBoss';
import JournalModal from './components/JournalModal';

import { levels, achievementsList, questPools } from './data/gameData';
import { loadGameData, saveGameData, loadDailyQuests, saveDailyQuests } from './utils/storage';
import { 
  saveJournalEntry, 
  updateJournalStreak, 
  getJournalStreak, 
  hasJournaledToday,
  checkJournalAchievements,
  getTotalEntries 
} from './utils/journalStorage';

const PinterestGame = () => {
  // --- Load saved base data synchronously
  const savedData = loadGameData();

  // --- State
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
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalStreak, setJournalStreak] = useState(0);
  const [hasJournaledTodayState, setHasJournaledTodayState] = useState(false);
  

  // --- Generate daily quests safely
  const generateDailyQuests = () => {
    // if saved and current, use saved
    const saved = loadDailyQuests();
    if (saved) return saved;

    // else generate
    const allQuests = Object.values(questPools).flat();
    const selected = [];
    const usedIndices = new Set();

    // Use a timestamp-based base to ensure stable, unique IDs
    const base = Date.now();

    while (selected.length < 5 && usedIndices.size < allQuests.length) {
      const idx = Math.floor(Math.random() * allQuests.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        // Unique id for local use (avoid collisions)
        selected.push({ ...allQuests[idx], id: base + idx + selected.length, done: false });
      }
    }

    saveDailyQuests(selected);
    return selected;
  };

  // Initialize daily quests (once on mount)
  useEffect(() => {
    setDailyQuests(generateDailyQuests());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Save base game data whenever xp / achievements / skillPoints change
  useEffect(() => {
    saveGameData(xp, achievements, skillPoints);
  }, [xp, achievements, skillPoints]);

  // Load journal streak on mount
  useEffect(() => {
    setJournalStreak(getJournalStreak());
    setHasJournaledTodayState(hasJournaledToday());
  }, []);

  // --- Helper functions for progression
  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].xpRequired) return levels[i];
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
        [skill]: (prev[skill] || 0) + amount
      }));
    }

    // celebrate level up
    const leveled = levels.find(l => newXP >= l.xpRequired && xp < l.xpRequired);
    if (leveled) {
      confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 }});
    }
  };

  // --- Quest handlers
  const completeQuest = (questId) => {
    const quest = dailyQuests.find(q => q.id === questId);
    if (!quest || quest.done) return;

    addXP(quest.xp, quest.skill);
    const updatedQuests = dailyQuests.map(q => q.id === questId ? { ...q, done: true } : q);
    setDailyQuests(updatedQuests);
    saveDailyQuests(updatedQuests);
  };

  // --- Deadlines
  const toggleDeadline = (id) => {
    const deadline = deadlines.find(d => d.id === id);
    if (deadline && !deadline.done) addXP(8, 'academic');
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d));
  };

  const addDeadline = () => {
    const text = prompt('Enter deadline (e.g., "STAT 416 HW - Tuesday")');
    if (!text) return;
    const newDeadline = { id: Date.now(), text, due: 'TBD', done: false };
    setDeadlines(prev => [...prev, newDeadline]);
  };

  // --- Achievements unlocking
  const unlockAchievement = (achievementId) => {
    if (achievements.includes(achievementId)) return;
    const ach = achievementsList.find(a => a.id === achievementId);
    if (!ach) return;
    setAchievements(prev => [...prev, achievementId]);
    addXP(ach.xpReward);
    confetti({ particleCount: 100, spread: 50, origin: { y: 0.7 }});
  };

  // --- Derived values
  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel ? ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100 : 100;
  const completedQuests = dailyQuests.filter(q => q.done).length;

  // icons and labels (kept local for now)
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

  // styles (kept inline for simplicity)
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3f3 0%, #fef2f2 50%, #fff5f0 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    maxWidth: { maxWidth: '1200px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: {
      fontSize: '48px', fontWeight: 'bold',
      background: 'linear-gradient(135deg, #e11d48 0%, #dc2626 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px'
    },
    subtitle: { color: '#6b7280', fontSize: '18px' },
    card: {
      background: 'white', borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '24px', marginBottom: '24px', border: '3px solid #fbcfe8'
    },
    sectionTitle: {
      fontSize: '20px', fontWeight: 'bold', color: '#1f2937',
      marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'
    },
    questItem: {
      padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb',
      marginBottom: '8px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', background: 'white'
    },
    questDone: { background: '#ecfdf5', opacity: 0.7 },
    button: {
      padding: '8px 16px', borderRadius: '8px', border: 'none',
      background: '#fce7f3', color: '#be185d', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }
  };

  // Handle journal entry submission
  const handleJournalSubmit = (journalEntry) => {
    try {
      // Save the entry
      const saved = saveJournalEntry(journalEntry);
      
      if (saved) {
        // Update streak
        const newStreak = updateJournalStreak();
        setJournalStreak(newStreak);
        setHasJournaledTodayState(true);
        
        // Add XP! 🎉
        addXP(10, 'balance');
        
        // Check for journal achievements
        const journalAchievements = checkJournalAchievements();
        
        // Unlock any new achievements
        journalAchievements.forEach(achId => {
          if (!achievements.includes(achId)) {
            // Find the achievement and unlock it
            const ach = achievementsList.find(a => a.id === achId);
            if (ach) {
              setAchievements(prev => [...prev, achId]);
              addXP(ach.xpReward);
            }
          }
        });
        
        console.log('✅ Journal entry saved! +10 XP, Streak:', newStreak);
      }
    } catch (error) {
      console.error('❌ Error submitting journal:', error);
      alert('Oops! Something went wrong saving your entry. Try again?');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎮 Mission Pinterest: The Mihika Saga</h1>
          <p style={styles.subtitle}>Your journey to Data Scientist ✨</p>
        </div>

        {/* Level */}
        <LevelCard
          currentLevel={currentLevel}
          nextLevel={nextLevel}
          xp={xp}
          progressToNext={progressToNext}
          styles={styles}
        />

        <div style={styles.grid}>
          <div>
            {/* Daily Quests */}
            <DailyQuests
              dailyQuests={dailyQuests}
              completeQuest={completeQuest}
              styles={styles}
            />
            {/* Journal Section */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>
                {/* Using the red accent color from other titles (e.g., LevelCard, SkillTree) */}
                <span style={{ color: '#e11d48', marginRight: '8px' }}>📝</span> Daily Journal
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  {/* Current Streak Stat (Red/XP Accent) */}
                  <div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                      Current Streak
                    </div>
                    {/* Color kept consistent with XP/Streak colors (#e11d48) */}
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🔥 {journalStreak} {journalStreak === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                  {/* Total Entries Stat (Neutralized color) */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                      Total Entries
                    </div>
                    {/* Changed purple to a neutral dark gray/blue for less visual noise, aligning with goal text in LevelCard */}
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}> 
                      {getTotalEntries()}
                    </div>
                  </div>
                </div>
                
                {hasJournaledTodayState ? (
                  // Completed State: Simplified and toned down to match the questDone style
                  <div style={{ 
                    padding: '16px', 
                    // Changed loud gradient to a soft, consistent light gray background (similar to questDone base)
                    background: '#f3f4f6', 
                    borderRadius: '10px', // Standardized radius
                    border: '2px solid #e5e7eb', // Softened border color
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '8px', color: '#10b981' }}>✅</div>
                    <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '4px' }}>
                      Journal Complete!
                    </div>
                    <div style={{ fontSize: '14px', color: '#047857' }}>
                      You've reflected today. Come back tomorrow! 🌟
                    </div>
                  </div>
                ) : (
                  // Button: Kept the bold gradient, standardized the radius, and simplified hover effects
                  <button
                    onClick={() => setShowJournalModal(true)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      // Kept the established purple-pink gradient from JournalModal/Quest buttons
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px', // Standardized radius
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      // Subtler shadow
                      boxShadow: '0 4px 8px rgba(168, 85, 247, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(168, 85, 247, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(168, 85, 247, 0.2)';
                    }}
                  >
                    🧠 Start Brain Dump (+10 XP)
                  </button>
                )}
              </div>

              {journalStreak > 0 && (
                // Streak Goal Hint: Simplified background and kept the original 'idea' theme
                <div style={{ 
                  fontSize: '13px', 
                  color: '#4b5563', // Darker text for readability
                  textAlign: 'center',
                  marginTop: '12px',
                  padding: '8px',
                  // Changed harsh yellow to a light amber-50 (similar to the journal prompt box in JournalModal)
                  background: '#fffbeb', 
                  borderRadius: '8px'
                }}>
                  💡 {journalStreak < 3 ? `${3 - journalStreak} more day${3 - journalStreak === 1 ? '' : 's'} to unlock 3-Day Streak!` :
                    journalStreak < 7 ? `${7 - journalStreak} more day${7 - journalStreak === 1 ? '' : 's'} to unlock Week Warrior!` :
                    journalStreak < 30 ? `${30 - journalStreak} more day${30 - journalStreak === 1 ? '' : 's'} to become a Legend!` :
                    "You're a journaling legend! 👑"}
                </div>
              )}
            </div>

            {/* Journal Modal */}
            {showJournalModal && (
              <JournalModal
                onClose={() => setShowJournalModal(false)}
                onSubmit={handleJournalSubmit}
                currentStreak={journalStreak}
              />
            )}

            {/* Skill Trees */}
            <SkillTree
              skillPoints={skillPoints}
              styles={styles}
              skillIcons={skillIcons}
              skillNames={skillNames}
            />

            {/* Achievements */}
            <Achievements
              achievements={achievements}
              achievementsList={achievementsList}
              unlockAchievement={unlockAchievement}
              styles={styles}
            />
          </div>

          <div>
            {/* Weekly Planner */}
            <WeeklyPlanner
              deadlines={deadlines}
              toggleDeadline={toggleDeadline}
              addDeadline={addDeadline}
              styles={styles}
            />

            {/* Journey Roadmap */}
            <JourneyRoadmap
              levels={levels}
              xp={xp}
              currentLevel={currentLevel}
              styles={styles}
            />
          </div>
        </div>

        {/* Final Boss */}
        <FinalBoss />
      </div>
    </div>
  );
};

export default PinterestGame;
