// 🗃️ storage.js — Handles saving and loading Mihika's game progress safely

const STORAGE_KEY = 'mihikaGameData';
const QUESTS_KEY = 'dailyQuests';
const QUEST_DATE_KEY = 'questDate';

/**
 * Load saved game data from localStorage safely
 */
export const loadGameData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        xp: data.xp || 0,
        achievements: data.achievements || [],
        skillPoints: data.skillPoints || { academic: 0, tech: 0, career: 0, networking: 0, balance: 0 }
      };
    }
  } catch (error) {
    console.error('⚠️ Error loading saved data:', error);
  }

  // Default values if nothing saved
  return {
    xp: 0,
    achievements: [],
    skillPoints: { academic: 0, tech: 0, career: 0, networking: 0, balance: 0 }
  };
};

/**
 * Save current game data
 */
export const saveGameData = (xp, achievements, skillPoints) => {
  try {
    const dataToSave = { xp, achievements, skillPoints };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('⚠️ Error saving game data:', error);
  }
};

/**
 * Reset all saved data (for debugging or “new game”)
 */
export const resetGameData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(QUESTS_KEY);
    localStorage.removeItem(QUEST_DATE_KEY);
    console.log('🧹 Game data reset!');
  } catch (error) {
    console.error('⚠️ Error resetting game data:', error);
  }
};

/**
 * Load daily quests from storage (with date validation)
 */
export const loadDailyQuests = () => {
  const today = new Date().toDateString();
  try {
    const savedQuests = localStorage.getItem(QUESTS_KEY);
    const savedDate = localStorage.getItem(QUEST_DATE_KEY);
    if (savedQuests && savedDate === today) {
      return JSON.parse(savedQuests);
    }
  } catch (error) {
    console.error('⚠️ Error loading daily quests:', error);
  }
  return null; // means “generate new ones”
};

/**
 * Save daily quests and quest date
 */
export const saveDailyQuests = (quests) => {
  const today = new Date().toDateString();
  try {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
    localStorage.setItem(QUEST_DATE_KEY, today);
  } catch (error) {
    console.error('⚠️ Error saving daily quests:', error);
  }
};
