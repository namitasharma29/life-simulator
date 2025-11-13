// 📚 topicStorage.js - Track what I am learning for personalized prompts

const TOPICS_KEY = 'mihikaLearningTopics';
const WEEKLY_LOG_KEY = 'mihikaWeeklyLog';
const LAST_LOG_DATE_KEY = 'mihikaLastLogDate';

/**
 * Save a new learning topic
 * @param {Object} topic - { course, topicName, confidence, notes, tags }
 * @returns {boolean} - Success status
 */
export const saveTopic = (topic) => {
  try {
    const topics = getAllTopics();
    
    const newTopic = {
      id: Date.now(), // Unique ID
      course: topic.course || '',
      topicName: topic.topicName || '',
      confidence: topic.confidence || 3, // 1-5 scale
      notes: topic.notes || '',
      tags: topic.tags || [], // e.g., ['math', 'linear-algebra']
      dateAdded: new Date().toISOString(),
      weekOf: getWeekIdentifier(), // e.g., "2024-W47"
    };
    
    topics.unshift(newTopic); // Add to beginning (most recent first)
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
    
    console.log('✅ Topic saved:', newTopic.topicName);
    return true;
  } catch (error) {
    console.error('❌ Error saving topic:', error);
    return false;
  }
};

/**
 * Get all learning topics
 * @returns {Array} - All topics, newest first
 */
export const getAllTopics = () => {
  try {
    const saved = localStorage.getItem(TOPICS_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error('❌ Error loading topics:', error);
    return [];
  }
};

/**
 * Update a topic's confidence level
 * @param {number} topicId - Topic ID
 * @param {number} newConfidence - New confidence (1-5)
 * @returns {boolean}
 */
export const updateTopicConfidence = (topicId, newConfidence) => {
  try {
    const topics = getAllTopics();
    const updated = topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, confidence: newConfidence, lastUpdated: new Date().toISOString() }
        : topic
    );
    localStorage.setItem(TOPICS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('❌ Error updating confidence:', error);
    return false;
  }
};

/**
 * Delete a topic
 * @param {number} topicId - Topic ID
 * @returns {boolean}
 */
export const deleteTopic = (topicId) => {
  try {
    const topics = getAllTopics();
    const filtered = topics.filter(t => t.id !== topicId);
    localStorage.setItem(TOPICS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('❌ Error deleting topic:', error);
    return false;
  }
};

// ============================================
// 🎯 SMART QUERIES
// ============================================

/**
 * Get topics from the last N days
 * @param {number} days - Number of days to look back
 * @returns {Array} - Recent topics
 */
export const getRecentTopics = (days = 7) => {
  const topics = getAllTopics();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return topics.filter(topic => {
    const topicDate = new Date(topic.dateAdded);
    return topicDate >= cutoffDate;
  });
};

/**
 * Get topics from this week only
 * @returns {Array} - This week's topics
 */
export const getThisWeekTopics = () => {
  const topics = getAllTopics();
  const currentWeek = getWeekIdentifier();
  
  return topics.filter(topic => topic.weekOf === currentWeek);
};

/**
 * Get topics with low confidence (1-3) for review
 * @returns {Array} - Topics needing review
 */
export const getLowConfidenceTopics = () => {
  const recentTopics = getRecentTopics(14); // Last 2 weeks
  return recentTopics.filter(topic => topic.confidence <= 3);
};

/**
 * Get topics by course
 * @param {string} courseName - e.g., "MA 279"
 * @returns {Array} - Topics from that course
 */
export const getTopicsByCourse = (courseName) => {
  const topics = getAllTopics();
  return topics.filter(topic => 
    topic.course.toLowerCase().includes(courseName.toLowerCase())
  );
};

/**
 * Get topics by tag
 * @param {string} tag - e.g., "linear-algebra", "statistics"
 * @returns {Array} - Topics with that tag
 */
export const getTopicsByTag = (tag) => {
  const topics = getAllTopics();
  return topics.filter(topic => 
    topic.tags && topic.tags.includes(tag)
  );
};

/**
 * Get a random topic (for generating prompts)
 * Weighted toward recent and low-confidence topics
 * @returns {Object|null} - A random topic
 */
export const getRandomTopicForPrompt = () => {
  const recentTopics = getRecentTopics(14); // Last 2 weeks
  
  if (recentTopics.length === 0) return null;
  
  // Weight selection: low confidence topics are 2x more likely
  const weightedTopics = [];
  recentTopics.forEach(topic => {
    const weight = topic.confidence <= 3 ? 2 : 1;
    for (let i = 0; i < weight; i++) {
      weightedTopics.push(topic);
    }
  });
  
  const randomIndex = Math.floor(Math.random() * weightedTopics.length);
  return weightedTopics[randomIndex];
};

/**
 * Get two random topics that might be related (for connection prompts)
 * @returns {Array} - [topic1, topic2] or []
 */
export const getRandomTopicPair = () => {
  const recentTopics = getRecentTopics(14);
  
  if (recentTopics.length < 2) return [];
  
  // Shuffle and pick first 2
  const shuffled = [...recentTopics].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
};

// ============================================
// 📊 STATISTICS
// ============================================

/**
 * Get topic count by course
 * @returns {Object} - { "MA 279": 5, "STAT 416": 3, ... }
 */
export const getTopicCountByCourse = () => {
  const topics = getAllTopics();
  const counts = {};
  
  topics.forEach(topic => {
    const course = topic.course || 'Other';
    counts[course] = (counts[course] || 0) + 1;
  });
  
  return counts;
};

/**
 * Get average confidence across all recent topics
 * @returns {number} - Average confidence (1-5)
 */
export const getAverageConfidence = () => {
  const recentTopics = getRecentTopics(14);
  if (recentTopics.length === 0) return 0;
  
  const sum = recentTopics.reduce((acc, topic) => acc + topic.confidence, 0);
  return (sum / recentTopics.length).toFixed(1);
};

/**
 * Get total topics learned this week vs last week
 * @returns {Object} - { thisWeek: 5, lastWeek: 3 }
 */
export const getWeeklyProgress = () => {
  const topics = getAllTopics();
  const thisWeek = getWeekIdentifier();
  const lastWeek = getWeekIdentifier(7); // 7 days ago
  
  return {
    thisWeek: topics.filter(t => t.weekOf === thisWeek).length,
    lastWeek: topics.filter(t => t.weekOf === lastWeek).length,
  };
};

// ============================================
// 📅 WEEKLY LOGGING
// ============================================

/**
 * Check if user has logged topics this week
 * @returns {boolean}
 */
export const hasLoggedThisWeek = () => {
  const lastLog = localStorage.getItem(LAST_LOG_DATE_KEY);
  if (!lastLog) return false;
  
  const currentWeek = getWeekIdentifier();
  return lastLog === currentWeek;
};

/**
 * Mark this week as logged
 */
export const markWeekAsLogged = () => {
  const currentWeek = getWeekIdentifier();
  localStorage.setItem(LAST_LOG_DATE_KEY, currentWeek);
};

/**
 * Save a weekly learning log (batch of topics)
 * @param {Array} topics - Array of topic objects
 * @returns {boolean}
 */
export const saveWeeklyLog = (topics) => {
  try {
    topics.forEach(topic => saveTopic(topic));
    markWeekAsLogged();
    console.log(`✅ Weekly log saved: ${topics.length} topics`);
    return true;
  } catch (error) {
    console.error('❌ Error saving weekly log:', error);
    return false;
  }
};

// ============================================
// 🛠️ UTILITY FUNCTIONS
// ============================================

/**
 * Get ISO week identifier (e.g., "2024-W47")
 * @param {number} daysAgo - Days to go back (default 0 = current week)
 * @returns {string} - Week identifier
 */
export const getWeekIdentifier = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

/**
 * Get a human-readable week range (e.g., "Nov 10 - Nov 16")
 * @returns {string}
 */
export const getCurrentWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
};

/**
 * Clear all topic data (for testing/reset)
 */
export const clearAllTopics = () => {
  try {
    localStorage.removeItem(TOPICS_KEY);
    localStorage.removeItem(LAST_LOG_DATE_KEY);
    console.log('🧹 All topic data cleared!');
    return true;
  } catch (error) {
    console.error('❌ Error clearing topics:', error);
    return false;
  }
};

/**
 * Export topics as JSON (for backup)
 * @returns {string} - JSON string
 */
export const exportTopics = () => {
  const data = {
    topics: getAllTopics(),
    stats: {
      total: getAllTopics().length,
      thisWeek: getThisWeekTopics().length,
      averageConfidence: getAverageConfidence(),
      byCourse: getTopicCountByCourse(),
    },
    exportDate: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
};

// Default export
export default {
  saveTopic,
  getAllTopics,
  updateTopicConfidence,
  deleteTopic,
  getRecentTopics,
  getThisWeekTopics,
  getLowConfidenceTopics,
  getTopicsByCourse,
  getTopicsByTag,
  getRandomTopicForPrompt,
  getRandomTopicPair,
  getTopicCountByCourse,
  getAverageConfidence,
  getWeeklyProgress,
  hasLoggedThisWeek,
  markWeekAsLogged,
  saveWeeklyLog,
  getWeekIdentifier,
  getCurrentWeekRange,
  clearAllTopics,
  exportTopics,
};