// 📚 topicBatchUtils.js - Helper functions for common topic operations

import topicStorage from './topicStorage';

/**
 * Quickly add multiple topics at once (useful for course imports)
 * @param {Array} topics - Array of topic objects
 * @returns {Object} - { success: count, failed: count }
 */
export const addMultipleTopics = (topics) => {
  let success = 0;
  let failed = 0;

  topics.forEach(topic => {
    if (topicStorage.saveTopic(topic)) {
      success++;
    } else {
      failed++;
    }
  });

  console.log(`✅ Added ${success} topics, ${failed} failed`);
  return { success, failed };
};

/**
 * Boost all low-confidence topics by 1 point
 * @returns {number} - Topics updated
 */
export const boostConfidenceAcrossBoard = () => {
  const allTopics = topicStorage.getAllTopics();
  let updated = 0;

  allTopics.forEach(topic => {
    if (topic.confidence < 5) {
      topicStorage.updateTopicConfidence(topic.id, topic.confidence + 1);
      updated++;
    }
  });

  console.log(`📈 Boosted confidence for ${updated} topics`);
  return updated;
};

/**
 * Get a summary of this week's learning
 * @returns {Object} - Stats about this week
 */
export const getWeekSummary = () => {
  const thisWeekTopics = topicStorage.getThisWeekTopics();
  const avgConfidence = topicStorage.getAverageConfidence();
  const byTag = {};
  const byCourse = topicStorage.getTopicCountByCourse();

  // Count by tag
  thisWeekTopics.forEach(topic => {
    if (topic.tags) {
      topic.tags.forEach(tag => {
        byTag[tag] = (byTag[tag] || 0) + 1;
      });
    }
  });

  return {
    topicsLogged: thisWeekTopics.length,
    averageConfidence: avgConfidence,
    topicsByCourse: byCourse,
    topicsByTag: byTag,
    lowConfidenceTopics: topicStorage.getLowConfidenceTopics().length,
  };
};

/**
 * Generate a learning report (for tracking progress over time)
 * @returns {string} - Formatted report
 */
export const generateLearningReport = () => {
  const summary = getWeekSummary();
  const allTopics = topicStorage.getAllTopics();

  let report = `
📊 LEARNING REPORT
${new Date().toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 This Week's Learning:
  • Topics Logged: ${summary.topicsLogged}
  • Average Confidence: ${summary.averageConfidence}/5
  • Total Topics (all time): ${allTopics.length}
  • Low-Confidence Topics: ${summary.lowConfidenceTopics}

📖 Topics by Course:
${Object.entries(summary.topicsByCourse)
  .map(([course, count]) => `  • ${course}: ${count}`)
  .join('\n')}

🏷️  Topics by Tag:
${Object.entries(summary.topicsByTag)
  .map(([tag, count]) => `  • ${tag}: ${count}`)
  .join('\n')}

💡 Tip: Focus on boosting the ${summary.lowConfidenceTopics} low-confidence topics!
  `;

  return report;
};

/**
 * Export topic data for backup/sharing
 * @returns {string} - JSON string ready to save
 */
export const backupTopics = () => {
  const data = {
    backup_date: new Date().toISOString(),
    topics: topicStorage.getAllTopics(),
    statistics: {
      total: topicStorage.getAllTopics().length,
      this_week: topicStorage.getThisWeekTopics().length,
      average_confidence: topicStorage.getAverageConfidence(),
      by_course: topicStorage.getTopicCountByCourse(),
    }
  };

  return JSON.stringify(data, null, 2);
};

/**
 * Import topics from a backup JSON file
 * @param {Array} topicsArray - Topics array from backup
 * @returns {Object} - { success: count, failed: count }
 */
export const restoreTopicsFromBackup = (topicsArray) => {
  if (!Array.isArray(topicsArray)) {
    console.error('❌ Invalid backup format');
    return { success: 0, failed: topicsArray.length || 0 };
  }

  return addMultipleTopics(topicsArray);
};

/**
 * Clear topics older than N days
 * @param {number} daysOld - Remove topics older than this
 * @returns {number} - Topics deleted
 */
export const clearOldTopics = (daysOld = 90) => {
  const allTopics = topicStorage.getAllTopics();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);

  let deleted = 0;
  allTopics.forEach(topic => {
    const topicDate = new Date(topic.dateAdded);
    if (topicDate < cutoff) {
      topicStorage.deleteTopic(topic.id);
      deleted++;
    }
  });

  console.log(`🧹 Deleted ${deleted} topics older than ${daysOld} days`);
  return deleted;
};

/**
 * Get topics that haven't been reviewed recently (for prompts)
 * @returns {Array} - Topics that should be reviewed
 */
export const getTopicsForReview = () => {
  const recent = topicStorage.getRecentTopics(7);
  const low = topicStorage.getLowConfidenceTopics();

  // Combine and deduplicate
  const combined = [...recent, ...low];
  const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());

  return unique.sort((a, b) => (a.confidence - b.confidence));
};

export default {
  addMultipleTopics,
  boostConfidenceAcrossBoard,
  getWeekSummary,
  generateLearningReport,
  backupTopics,
  restoreTopicsFromBackup,
  clearOldTopics,
  getTopicsForReview,
};
