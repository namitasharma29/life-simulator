// 📊 weeklyReviewStorage.js - Track weekly reflections and generate insights

import topicStorage from './topicStorage';

const WEEKLY_REVIEWS_KEY = 'mihikaWeeklyReviews';
const LAST_REVIEW_WEEK_KEY = 'mihikaLastReviewWeek';

// ============================================
// 💾 SAVE & LOAD REVIEWS
// ============================================

/**
 * Save a weekly review
 * @param {Object} reviewData - Complete review data
 * @returns {boolean} - Success status
 */
export const saveWeeklyReview = (reviewData) => {
  try {
    const reviews = getAllReviews();
    const weekOf = topicStorage.getWeekIdentifier();
    
    const newReview = {
      id: Date.now(),
      weekOf: weekOf,
      weekRange: topicStorage.getCurrentWeekRange(),
      dateCompleted: new Date().toISOString(),
      
      // Topic review data
      topics: reviewData.topics || [],
      topicsReviewed: reviewData.topics?.length || 0,
      avgConfidenceBefore: calculateAvgConfidence(reviewData.topics, 'before'),
      avgConfidenceAfter: calculateAvgConfidence(reviewData.topics, 'after'),
      
      // Reflection data
      biggestWin: reviewData.biggestWin || '',
      biggestWTF: reviewData.biggestWTF || '',
      
      // Next week planning
      nextWeekFocus: reviewData.nextWeekFocus || [],
      customGoal: reviewData.customGoal || '',
      
      // Stats snapshot
      stats: {
        topicsLoggedThisWeek: topicStorage.getThisWeekTopics().length,
        avgConfidence: parseFloat(topicStorage.getAverageConfidence()),
        totalTopicsAllTime: topicStorage.getAllTopics().length,
        lowConfidenceCount: topicStorage.getLowConfidenceTopics().length,
      },
      
      // Generated quests for next week (to be filled in later)
      generatedQuests: reviewData.generatedQuests || []
    };
    
    // Add to beginning (most recent first)
    reviews.unshift(newReview);
    
    // Save to localStorage
    localStorage.setItem(WEEKLY_REVIEWS_KEY, JSON.stringify(reviews));
    localStorage.setItem(LAST_REVIEW_WEEK_KEY, weekOf);
    
    console.log('✅ Weekly review saved for week:', weekOf);
    return true;
  } catch (error) {
    console.error('❌ Error saving weekly review:', error);
    return false;
  }
};

/**
 * Get all weekly reviews
 * @returns {Array} - All reviews, newest first
 */
export const getAllReviews = () => {
  try {
    const saved = localStorage.getItem(WEEKLY_REVIEWS_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error('❌ Error loading reviews:', error);
    return [];
  }
};

/**
 * Get this week's review (if it exists)
 * @returns {Object|null} - This week's review or null
 */
export const getThisWeekReview = () => {
  const reviews = getAllReviews();
  const currentWeek = topicStorage.getWeekIdentifier();
  
  return reviews.find(r => r.weekOf === currentWeek) || null;
};

/**
 * Get last week's review
 * @returns {Object|null} - Last week's review or null
 */
export const getLastWeekReview = () => {
  const reviews = getAllReviews();
  const lastWeek = topicStorage.getWeekIdentifier(7); // 7 days ago
  
  return reviews.find(r => r.weekOf === lastWeek) || null;
};

/**
 * Check if user has completed review this week
 * @returns {boolean}
 */
export const hasReviewedThisWeek = () => {
  const currentWeek = topicStorage.getWeekIdentifier();
  const lastReviewWeek = localStorage.getItem(LAST_REVIEW_WEEK_KEY);
  
  return lastReviewWeek === currentWeek;
};

/**
 * Delete a specific review
 * @param {number} reviewId - Review ID
 * @returns {boolean}
 */
export const deleteReview = (reviewId) => {
  try {
    const reviews = getAllReviews();
    const filtered = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem(WEEKLY_REVIEWS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('❌ Error deleting review:', error);
    return false;
  }
};

// ============================================
// 📊 ANALYTICS & INSIGHTS
// ============================================

/**
 * Get review completion rate (% of weeks with reviews)
 * @param {number} weeksBack - How many weeks to analyze
 * @returns {number} - Percentage (0-100)
 */
export const getReviewCompletionRate = (weeksBack = 8) => {
  const reviews = getAllReviews();
  if (reviews.length === 0) return 0;
  
  // Count unique weeks with reviews in last N weeks
  const weeksWithReviews = new Set(
    reviews
      .filter(r => {
        const reviewWeek = r.weekOf;
        const cutoffWeek = topicStorage.getWeekIdentifier(weeksBack * 7);
        return reviewWeek >= cutoffWeek;
      })
      .map(r => r.weekOf)
  );
  
  const completionRate = (weeksWithReviews.size / weeksBack) * 100;
  return Math.round(completionRate);
};

/**
 * Get review streak (consecutive weeks with reviews)
 * @returns {number} - Current streak
 */
export const getReviewStreak = () => {
  const reviews = getAllReviews();
  if (reviews.length === 0) return 0;
  
  // Sort by week (newest first)
  const sortedReviews = [...reviews].sort((a, b) => b.weekOf.localeCompare(a.weekOf));
  
  let streak = 0;
  const currentWeek = topicStorage.getWeekIdentifier();
  
  // Check if current week is reviewed
  if (sortedReviews[0]?.weekOf === currentWeek) {
    streak = 1;
    
    // Count consecutive weeks backwards
    for (let i = 1; i < sortedReviews.length; i++) {
      const expectedWeek = topicStorage.getWeekIdentifier((i) * 7);
      if (sortedReviews[i]?.weekOf === expectedWeek) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  return streak;
};

/**
 * Compare this week to last week
 * @returns {Object} - Comparison data
 */
export const getWeekOverWeekComparison = () => {
  const thisWeekReview = getThisWeekReview();
  const lastWeekReview = getLastWeekReview();
  
  // Current week stats (even if not reviewed yet)
  const thisWeekTopics = topicStorage.getThisWeekTopics().length;
  const thisWeekConfidence = parseFloat(topicStorage.getAverageConfidence());
  
  // Last week stats (from review if available)
  const lastWeekTopics = lastWeekReview?.stats.topicsLoggedThisWeek || 0;
  const lastWeekConfidence = lastWeekReview?.stats.avgConfidence || 0;
  
  return {
    topics: {
      thisWeek: thisWeekTopics,
      lastWeek: lastWeekTopics,
      change: thisWeekTopics - lastWeekTopics,
      percentChange: lastWeekTopics > 0 ? Math.round(((thisWeekTopics - lastWeekTopics) / lastWeekTopics) * 100) : 0
    },
    confidence: {
      thisWeek: thisWeekConfidence,
      lastWeek: lastWeekConfidence,
      change: (thisWeekConfidence - lastWeekConfidence).toFixed(1),
      percentChange: lastWeekConfidence > 0 ? Math.round(((thisWeekConfidence - lastWeekConfidence) / lastWeekConfidence) * 100) : 0
    }
  };
};

/**
 * Get all "biggest wins" across reviews (for motivation!)
 * @param {number} limit - Max number to return
 * @returns {Array} - Array of wins with dates
 */
export const getAllWins = (limit = 10) => {
  const reviews = getAllReviews();
  
  return reviews
    .filter(r => r.biggestWin && r.biggestWin.trim().length > 0)
    .slice(0, limit)
    .map(r => ({
      win: r.biggestWin,
      weekRange: r.weekRange,
      date: new Date(r.dateCompleted).toLocaleDateString()
    }));
};

/**
 * Get recurring WTFs (confusion patterns)
 * @returns {Array} - Common confusion themes
 */
export const getRecurringWTFs = () => {
  const reviews = getAllReviews();
  
  const wtfs = reviews
    .filter(r => r.biggestWTF && r.biggestWTF.trim().length > 0)
    .map(r => ({
      wtf: r.biggestWTF,
      weekRange: r.weekRange
    }));
  
  return wtfs;
};

/**
 * Get confidence growth trend over time
 * @returns {Array} - Array of { week, confidence }
 */
export const getConfidenceTrend = () => {
  const reviews = getAllReviews();
  
  return reviews
    .slice(0, 12) // Last 12 weeks
    .reverse() // Oldest first for chart
    .map(r => ({
      week: r.weekRange,
      confidence: r.stats.avgConfidence || 0
    }));
};

/**
 * Get topics learned trend over time
 * @returns {Array} - Array of { week, count }
 */
export const getTopicsLearnedTrend = () => {
  const reviews = getAllReviews();
  
  return reviews
    .slice(0, 12) // Last 12 weeks
    .reverse() // Oldest first for chart
    .map(r => ({
      week: r.weekRange,
      count: r.stats.topicsLoggedThisWeek || 0
    }));
};

// ============================================
// 🎯 NEXT WEEK QUEST GENERATION
// ============================================

/**
 * Generate personalized quests for next week based on review
 * @param {Object} reviewData - The weekly review data
 * @returns {Array} - Array of quest objects
 */
export const generateNextWeekQuests = (reviewData) => {
  const quests = [];
  
  // 1. Review low-confidence topics (2-3 quests)
  const lowConfTopics = reviewData.topics?.filter(t => t.confidenceAfter <= 3) || [];
  lowConfTopics.slice(0, 2).forEach(topic => {
    quests.push({
      text: `Review ${topic.topicName} (20 min focused practice)`,
      xp: 15,
      skill: 'academic',
      priority: 'high',
      source: 'low-confidence'
    });
  });
  
  // 2. Apply recent learning - build something (1-2 quests)
  const recentHighConfidence = reviewData.topics?.filter(t => t.confidenceAfter >= 4).slice(0, 2) || [];
  if (recentHighConfidence.length > 0) {
    const topic = recentHighConfidence[0];
    quests.push({
      text: `Build a mini-project using ${topic.topicName}`,
      xp: 25,
      skill: 'tech',
      priority: 'medium',
      source: 'application'
    });
  }
  
  // 3. Address the biggest WTF (1 quest)
  if (reviewData.biggestWTF && reviewData.biggestWTF.trim().length > 0) {
    const shortWTF = reviewData.biggestWTF.substring(0, 50);
    quests.push({
      text: `Research and clarify: "${shortWTF}${reviewData.biggestWTF.length > 50 ? '...' : ''}"`,
      xp: 20,
      skill: 'academic',
      priority: 'high',
      source: 'wtf'
    });
  }
  
  // 4. Practice interview questions related to topics (1 quest)
  if (reviewData.topics && reviewData.topics.length > 0) {
    const randomTopic = reviewData.topics[Math.floor(Math.random() * reviewData.topics.length)];
    quests.push({
      text: `Practice 2 interview questions related to ${randomTopic.topicName}`,
      xp: 20,
      skill: 'career',
      priority: 'medium',
      source: 'interview-prep'
    });
  }
  
  // 5. User's custom goal (1 quest) - HIGHEST PRIORITY
  if (reviewData.customGoal && reviewData.customGoal.trim().length > 0) {
    quests.push({
      text: reviewData.customGoal,
      xp: 30,
      skill: 'career',
      priority: 'high',
      source: 'custom-goal'
    });
  }
  
  // 6. Explain it back challenge (Feynman technique) (1 quest)
  const teachableTopic = reviewData.topics?.find(t => t.confidenceAfter >= 3);
  if (teachableTopic) {
    quests.push({
      text: `Explain ${teachableTopic.topicName} to someone in simple terms (Feynman technique)`,
      xp: 15,
      skill: 'academic',
      priority: 'medium',
      source: 'feynman'
    });
  }
  
  // 7. Balance & wellness (1 quest) - ALWAYS INCLUDE
  quests.push({
    text: 'Take a 30-min walk and reflect on your learning journey',
    xp: 5,
    skill: 'balance',
    priority: 'low',
    source: 'balance'
  });
  
  // Sort by priority and return max 7 quests
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return quests
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 7);
};

// ============================================
// 🛠️ UTILITY FUNCTIONS
// ============================================

/**
 * Calculate average confidence from topic array
 * @param {Array} topics - Topics with confidence values
 * @param {string} type - 'before' or 'after'
 * @returns {number} - Average confidence
 */
function calculateAvgConfidence(topics, type = 'after') {
  if (!topics || topics.length === 0) return 0;
  
  const key = type === 'before' ? 'confidenceBefore' : 'confidenceAfter';
  const sum = topics.reduce((acc, t) => acc + (t[key] || t.confidence || 3), 0);
  
  return parseFloat((sum / topics.length).toFixed(1));
}

/**
 * Get summary stats for all reviews
 * @returns {Object} - Overall stats
 */
export const getOverallReviewStats = () => {
  const reviews = getAllReviews();
  
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      completionRate: 0,
      currentStreak: 0,
      averageConfidenceGrowth: 0,
      totalWins: 0
    };
  }
  
  const confidenceGrowths = reviews
    .filter(r => r.avgConfidenceBefore && r.avgConfidenceAfter)
    .map(r => r.avgConfidenceAfter - r.avgConfidenceBefore);
  
  const avgGrowth = confidenceGrowths.length > 0
    ? (confidenceGrowths.reduce((a, b) => a + b, 0) / confidenceGrowths.length).toFixed(2)
    : 0;
  
  return {
    totalReviews: reviews.length,
    completionRate: getReviewCompletionRate(8),
    currentStreak: getReviewStreak(),
    averageConfidenceGrowth: parseFloat(avgGrowth),
    totalWins: reviews.filter(r => r.biggestWin).length
  };
};

/**
 * Clear all review data (for testing/reset)
 */
export const clearAllReviews = () => {
  try {
    localStorage.removeItem(WEEKLY_REVIEWS_KEY);
    localStorage.removeItem(LAST_REVIEW_WEEK_KEY);
    console.log('🧹 All review data cleared!');
    return true;
  } catch (error) {
    console.error('❌ Error clearing reviews:', error);
    return false;
  }
};

/**
 * Export review data as JSON (for backup)
 * @returns {string} - JSON string
 */
export const exportReviews = () => {
  const data = {
    reviews: getAllReviews(),
    stats: getOverallReviewStats(),
    exportDate: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
};

// Default export
export default {
  saveWeeklyReview,
  getAllReviews,
  getThisWeekReview,
  getLastWeekReview,
  hasReviewedThisWeek,
  deleteReview,
  getReviewCompletionRate,
  getReviewStreak,
  getWeekOverWeekComparison,
  getAllWins,
  getRecurringWTFs,
  getConfidenceTrend,
  getTopicsLearnedTrend,
  generateNextWeekQuests,
  getOverallReviewStats,
  clearAllReviews,
  exportReviews
};