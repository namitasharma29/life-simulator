// 📝 journalStorage.js - Handles all journal entry persistence and streak tracking

const JOURNAL_ENTRIES_KEY = 'mihikaJournalEntries';
const JOURNAL_STREAK_KEY = 'mihikaJournalStreak';
const JOURNAL_LAST_DATE_KEY = 'mihikaJournalLastDate';

// ============================================
// 💾 SAVE & LOAD ENTRIES
// ============================================

/**
 * Save a new journal entry
 * @param {Object} entry - { date, prompt, category, entry, wordCount }
 * @returns {boolean} - Success status
 */
export const saveJournalEntry = (entry) => {
  try {
    // Get existing entries
    const entries = getAllJournalEntries();
    
    // Add new entry at the beginning (most recent first)
    entries.unshift(entry);
    
    // Save back to localStorage
    localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));
    
    // Update last journal date
    const today = new Date().toDateString();
    localStorage.setItem(JOURNAL_LAST_DATE_KEY, today);
    
    console.log('✅ Journal entry saved!');
    return true;
  } catch (error) {
    console.error('❌ Error saving journal entry:', error);
    return false;
  }
};

/**
 * Get all journal entries (sorted by date, newest first)
 * @returns {Array} - Array of journal entries
 */
export const getAllJournalEntries = () => {
  try {
    const saved = localStorage.getItem(JOURNAL_ENTRIES_KEY);
    if (!saved) return [];
    
    const entries = JSON.parse(saved);
    return entries;
  } catch (error) {
    console.error('❌ Error loading journal entries:', error);
    return [];
  }
};

/**
 * Get journal entries for a specific date
 * @param {string} dateString - Date in any format
 * @returns {Array} - Entries from that date
 */
export const getEntriesByDate = (dateString) => {
  const allEntries = getAllJournalEntries();
  const targetDate = new Date(dateString).toDateString();
  
  return allEntries.filter(entry => {
    const entryDate = new Date(entry.date).toDateString();
    return entryDate === targetDate;
  });
};

/**
 * Check if user has journaled today
 * @returns {boolean}
 */
export const hasJournaledToday = () => {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(JOURNAL_LAST_DATE_KEY);
  
  return lastDate === today;
};

// ============================================
// 🔥 STREAK TRACKING
// ============================================

/**
 * Update the journal streak after a new entry
 * @returns {number} - New streak count
 */
export const updateJournalStreak = () => {
  try {
    const today = new Date();
    const todayString = today.toDateString();
    const lastDate = localStorage.getItem(JOURNAL_LAST_DATE_KEY);
    
    // If no previous date, this is day 1
    if (!lastDate) {
      localStorage.setItem(JOURNAL_STREAK_KEY, '1');
      localStorage.setItem(JOURNAL_LAST_DATE_KEY, todayString);
      return 1;
    }
    
    // If already journaled today, don't update streak
    if (lastDate === todayString) {
      const currentStreak = parseInt(localStorage.getItem(JOURNAL_STREAK_KEY) || '1');
      return currentStreak;
    }
    
    // Check if last entry was yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    let newStreak;
    if (lastDate === yesterdayString) {
      // Continue streak
      const currentStreak = parseInt(localStorage.getItem(JOURNAL_STREAK_KEY) || '0');
      newStreak = currentStreak + 1;
    } else {
      // Streak broken, start over
      newStreak = 1;
    }
    
    localStorage.setItem(JOURNAL_STREAK_KEY, newStreak.toString());
    localStorage.setItem(JOURNAL_LAST_DATE_KEY, todayString);
    
    return newStreak;
  } catch (error) {
    console.error('❌ Error updating streak:', error);
    return 1;
  }
};

/**
 * Get current journal streak
 * @returns {number} - Current streak count
 */
export const getJournalStreak = () => {
  try {
    // Check if streak is still valid
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(JOURNAL_LAST_DATE_KEY);
    
    if (!lastDate) return 0;
    
    // If last entry was today, return current streak
    if (lastDate === today) {
      return parseInt(localStorage.getItem(JOURNAL_STREAK_KEY) || '0');
    }
    
    // If last entry was yesterday, streak is still alive
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    if (lastDate === yesterdayString) {
      return parseInt(localStorage.getItem(JOURNAL_STREAK_KEY) || '0');
    }
    
    // Streak broken - reset to 0
    localStorage.setItem(JOURNAL_STREAK_KEY, '0');
    return 0;
  } catch (error) {
    console.error('❌ Error getting streak:', error);
    return 0;
  }
};

/**
 * Get longest streak ever achieved
 * @returns {number} - Longest streak
 */
export const getLongestStreak = () => {
  try {
    const entries = getAllJournalEntries();
    if (entries.length === 0) return 0;
    
    // Sort entries by date (oldest first for streak calculation)
    const sortedEntries = entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const prevDate = new Date(sortedEntries[i - 1].date);
      const currDate = new Date(sortedEntries[i].date);
      
      // Get date strings (ignore time)
      const prevDateString = prevDate.toDateString();
      const currDateString = currDate.toDateString();
      
      // If same day, skip (don't count multiple entries per day)
      if (prevDateString === currDateString) continue;
      
      // Check if consecutive days
      const nextDay = new Date(prevDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toDateString();
      
      if (currDateString === nextDayString) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  } catch (error) {
    console.error('❌ Error calculating longest streak:', error);
    return 0;
  }
};

// ============================================
// 📊 STATISTICS & ANALYTICS
// ============================================

/**
 * Get total number of journal entries
 * @returns {number}
 */
export const getTotalEntries = () => {
  return getAllJournalEntries().length;
};

/**
 * Get entries from the last N days
 * @param {number} days - Number of days to look back
 * @returns {Array} - Entries from last N days
 */
export const getRecentEntries = (days = 7) => {
  const allEntries = getAllJournalEntries();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  });
};

/**
 * Get entries grouped by category
 * @returns {Object} - { category: count }
 */
export const getEntriesByCategory = () => {
  const allEntries = getAllJournalEntries();
  const categoryCount = {};
  
  allEntries.forEach(entry => {
    const category = entry.category || 'unknown';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  return categoryCount;
};

/**
 * Get journaling days in current month (for heatmap)
 * @returns {Array} - Array of date strings that have entries
 */
export const getJournalingDaysThisMonth = () => {
  const allEntries = getAllJournalEntries();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysWithEntries = new Set();
  
  allEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
      daysWithEntries.add(entryDate.toDateString());
    }
  });
  
  return Array.from(daysWithEntries);
};

/**
 * Calculate which achievements should be unlocked
 * @returns {Array} - Array of achievement IDs to unlock
 */
export const checkJournalAchievements = () => {
  const achievements = [];
  const totalEntries = getTotalEntries();
  const currentStreak = getJournalStreak();
  
  // First Entry
  if (totalEntries >= 1) {
    achievements.push('first-entry');
  }
  
  // 3-Day Streak
  if (currentStreak >= 3) {
    achievements.push('3-day-streak');
  }
  
  // Week Warrior (7 days)
  if (currentStreak >= 7) {
    achievements.push('week-warrior');
  }
  
  // Insight Hunter (20 entries)
  if (totalEntries >= 20) {
    achievements.push('insight-hunter');
  }
  
  // 30-Day Legend
  if (currentStreak >= 30) {
    achievements.push('30-day-legend');
  }
  
  return achievements;
};

// ============================================
// 🧹 UTILITY FUNCTIONS
// ============================================

/**
 * Delete a specific entry
 * @param {string} entryDate - ISO date string of entry to delete
 * @returns {boolean} - Success status
 */
export const deleteJournalEntry = (entryDate) => {
  try {
    const entries = getAllJournalEntries();
    const filteredEntries = entries.filter(entry => entry.date !== entryDate);
    
    localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(filteredEntries));
    return true;
  } catch (error) {
    console.error('❌ Error deleting entry:', error);
    return false;
  }
};

/**
 * Clear all journal data (for testing/reset)
 */
export const clearAllJournalData = () => {
  try {
    localStorage.removeItem(JOURNAL_ENTRIES_KEY);
    localStorage.removeItem(JOURNAL_STREAK_KEY);
    localStorage.removeItem(JOURNAL_LAST_DATE_KEY);
    console.log('🧹 All journal data cleared!');
    return true;
  } catch (error) {
    console.error('❌ Error clearing journal data:', error);
    return false;
  }
};

/**
 * Export journal data as JSON (for backup)
 * @returns {string} - JSON string of all data
 */
export const exportJournalData = () => {
  const data = {
    entries: getAllJournalEntries(),
    streak: getJournalStreak(),
    longestStreak: getLongestStreak(),
    totalEntries: getTotalEntries(),
    exportDate: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
};

// Default export with all functions
export default {
  saveJournalEntry,
  getAllJournalEntries,
  getEntriesByDate,
  hasJournaledToday,
  updateJournalStreak,
  getJournalStreak,
  getLongestStreak,
  getTotalEntries,
  getRecentEntries,
  getEntriesByCategory,
  getJournalingDaysThisMonth,
  checkJournalAchievements,
  deleteJournalEntry,
  clearAllJournalData,
  exportJournalData,
};