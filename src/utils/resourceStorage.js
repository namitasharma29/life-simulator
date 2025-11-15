// 📚 resourceStorage.js - Manage learning resources for DS journey

const RESOURCES_KEY = 'mihikaResourceLibrary';
const RESOURCE_STATS_KEY = 'mihikaResourceStats';

// Resource types
export const RESOURCE_TYPES = {
  VIDEO: 'video',
  ARTICLE: 'article',
  TUTORIAL: 'tutorial',
  DATASET: 'dataset',
  TOOL: 'tool',
  PAPER: 'paper',
  COURSE: 'course',
  DOCUMENTATION: 'documentation'
};

// Resource status
export const RESOURCE_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

// Difficulty levels
export const DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// ============================================
// 💾 SAVE & LOAD RESOURCES
// ============================================

/**
 * Save a new resource to the library
 * @param {Object} resource - Resource data
 * @returns {boolean} - Success status
 */
export const saveResource = (resource) => {
  try {
    const resources = getAllResources();
    
    const newResource = {
      id: Date.now(),
      title: resource.title || '',
      type: resource.type || RESOURCE_TYPES.ARTICLE,
      url: resource.url || '',
      description: resource.description || '',
      duration: resource.duration || null, // minutes
      difficulty: resource.difficulty || DIFFICULTY.INTERMEDIATE,
      
      // Topics this resource teaches
      topics: resource.topics || [],
      
      // Tags for filtering
      tags: resource.tags || [],
      
      // Tracking
      status: RESOURCE_STATUS.NOT_STARTED,
      dateAdded: new Date().toISOString(),
      dateStarted: null,
      dateCompleted: null,
      
      // User engagement
      personalNotes: '',
      rating: null, // 1-5
      
      // Metadata
      author: resource.author || '',
      source: resource.source || '', // e.g., "YouTube", "Medium", "Kaggle"
      
      // Project linking
      linkedProjects: resource.linkedProjects || [], // Project IDs that use this resource
      
      // Recommendation
      recommended: resource.recommended || false
    };
    
    resources.unshift(newResource);
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
    
    console.log('✅ Resource saved:', newResource.title);
    return true;
  } catch (error) {
    console.error('❌ Error saving resource:', error);
    return false;
  }
};

/**
 * Get all resources
 * @returns {Array} - All resources, newest first
 */
export const getAllResources = () => {
  try {
    const saved = localStorage.getItem(RESOURCES_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error('❌ Error loading resources:', error);
    return [];
  }
};

/**
 * Get a specific resource by ID
 * @param {number} resourceId - Resource ID
 * @returns {Object|null} - Resource or null
 */
export const getResourceById = (resourceId) => {
  const resources = getAllResources();
  return resources.find(r => r.id === resourceId) || null;
};

/**
 * Update a resource
 * @param {number} resourceId - Resource ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} - Success status
 */
export const updateResource = (resourceId, updates) => {
  try {
    const resources = getAllResources();
    const updated = resources.map(r => 
      r.id === resourceId 
        ? { ...r, ...updates, lastUpdated: new Date().toISOString() }
        : r
    );
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('❌ Error updating resource:', error);
    return false;
  }
};

/**
 * Delete a resource
 * @param {number} resourceId - Resource ID
 * @returns {boolean} - Success status
 */
export const deleteResource = (resourceId) => {
  try {
    const resources = getAllResources();
    const filtered = resources.filter(r => r.id !== resourceId);
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('❌ Error deleting resource:', error);
    return false;
  }
};

// ============================================
// 📊 RESOURCE STATUS MANAGEMENT
// ============================================

/**
 * Update resource status
 * @param {number} resourceId - Resource ID
 * @param {string} newStatus - New status
 * @returns {boolean} - Success status
 */
export const updateResourceStatus = (resourceId, newStatus) => {
  try {
    const resources = getAllResources();
    const resource = resources.find(r => r.id === resourceId);
    
    if (!resource) return false;
    
    const updates = { status: newStatus };
    
    // Track dates based on status
    if (newStatus === RESOURCE_STATUS.IN_PROGRESS && !resource.dateStarted) {
      updates.dateStarted = new Date().toISOString();
    }
    
    if (newStatus === RESOURCE_STATUS.COMPLETED && !resource.dateCompleted) {
      updates.dateCompleted = new Date().toISOString();
    }
    
    return updateResource(resourceId, updates);
  } catch (error) {
    console.error('❌ Error updating status:', error);
    return false;
  }
};

/**
 * Mark resource as completed
 * @param {number} resourceId - Resource ID
 * @returns {Object} - { success: boolean, xpEarned: number }
 */
export const markResourceComplete = (resourceId) => {
  const success = updateResourceStatus(resourceId, RESOURCE_STATUS.COMPLETED);
  
  if (success) {
    // Award XP based on resource type and difficulty
    const resource = getResourceById(resourceId);
    let xp = 10; // Base XP
    
    // Bonus for difficulty
    if (resource.difficulty === DIFFICULTY.INTERMEDIATE) xp += 5;
    if (resource.difficulty === DIFFICULTY.ADVANCED) xp += 10;
    
    // Bonus for longer content
    if (resource.duration > 60) xp += 5;
    if (resource.duration > 120) xp += 10;
    
    console.log(`✅ Resource completed! +${xp} XP`);
    return { success: true, xpEarned: xp };
  }
  
  return { success: false, xpEarned: 0 };
};

/**
 * Add personal notes to a resource
 * @param {number} resourceId - Resource ID
 * @param {string} notes - Personal notes
 * @returns {boolean} - Success status
 */
export const addPersonalNotes = (resourceId, notes) => {
  return updateResource(resourceId, { personalNotes: notes });
};

/**
 * Rate a resource
 * @param {number} resourceId - Resource ID
 * @param {number} rating - Rating 1-5
 * @returns {boolean} - Success status
 */
export const rateResource = (resourceId, rating) => {
  if (rating < 1 || rating > 5) return false;
  return updateResource(resourceId, { rating });
};

// ============================================
// 🔍 SEARCH & FILTER
// ============================================

/**
 * Get resources by status
 * @param {string} status - Resource status
 * @returns {Array} - Filtered resources
 */
export const getResourcesByStatus = (status) => {
  const resources = getAllResources();
  return resources.filter(r => r.status === status);
};

/**
 * Get resources by type
 * @param {string} type - Resource type
 * @returns {Array} - Filtered resources
 */
export const getResourcesByType = (type) => {
  const resources = getAllResources();
  return resources.filter(r => r.type === type);
};

/**
 * Get resources by topic
 * @param {string} topic - Topic name
 * @returns {Array} - Filtered resources
 */
export const getResourcesByTopic = (topic) => {
  const resources = getAllResources();
  return resources.filter(r => 
    r.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
  );
};

/**
 * Get resources by tag
 * @param {string} tag - Tag name
 * @returns {Array} - Filtered resources
 */
export const getResourcesByTag = (tag) => {
  const resources = getAllResources();
  return resources.filter(r => 
    r.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

/**
 * Search resources by query
 * @param {string} query - Search query
 * @returns {Array} - Matching resources
 */
export const searchResources = (query) => {
  if (!query || query.trim().length === 0) return getAllResources();
  
  const resources = getAllResources();
  const lowerQuery = query.toLowerCase();
  
  return resources.filter(r => 
    r.title.toLowerCase().includes(lowerQuery) ||
    r.description.toLowerCase().includes(lowerQuery) ||
    r.topics.some(t => t.toLowerCase().includes(lowerQuery)) ||
    r.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
    r.author.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Advanced filter
 * @param {Object} filters - { type, difficulty, status, topics, tags }
 * @returns {Array} - Filtered resources
 */
export const filterResources = (filters) => {
  let resources = getAllResources();
  
  if (filters.type) {
    resources = resources.filter(r => r.type === filters.type);
  }
  
  if (filters.difficulty) {
    resources = resources.filter(r => r.difficulty === filters.difficulty);
  }
  
  if (filters.status) {
    resources = resources.filter(r => r.status === filters.status);
  }
  
  if (filters.topics && filters.topics.length > 0) {
    resources = resources.filter(r => 
      filters.topics.some(topic => 
        r.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
      )
    );
  }
  
  if (filters.tags && filters.tags.length > 0) {
    resources = resources.filter(r => 
      filters.tags.some(tag => 
        r.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }
  
  return resources;
};

// ============================================
// 🎯 SMART RECOMMENDATIONS
// ============================================

/**
 * Get recommended resources for low-confidence topics
 * @param {Array} userTopics - User's topics with confidence levels
 * @returns {Array} - Recommended resources
 */
export const getRecommendedResources = (userTopics) => {
  // Get topics with low confidence (1-3)
  const lowConfTopics = userTopics
    .filter(t => t.confidence <= 3)
    .map(t => t.topicName);
  
  if (lowConfTopics.length === 0) return [];
  
  const resources = getAllResources();
  
  // Find resources that teach these topics and aren't completed yet
  return resources.filter(r => 
    r.status !== RESOURCE_STATUS.COMPLETED &&
    r.topics.some(topic => 
      lowConfTopics.some(lowTopic => 
        topic.toLowerCase().includes(lowTopic.toLowerCase()) ||
        lowTopic.toLowerCase().includes(topic.toLowerCase())
      )
    )
  );
};

/**
 * Get next-level resources for high-confidence topics
 * @param {Array} userTopics - User's topics with confidence levels
 * @returns {Array} - Advanced resources
 */
export const getAdvancedResources = (userTopics) => {
  // Get topics with high confidence (4-5)
  const highConfTopics = userTopics
    .filter(t => t.confidence >= 4)
    .map(t => t.topicName);
  
  if (highConfTopics.length === 0) return [];
  
  const resources = getAllResources();
  
  // Find advanced/intermediate resources for these topics
  return resources.filter(r => 
    r.status !== RESOURCE_STATUS.COMPLETED &&
    (r.difficulty === DIFFICULTY.INTERMEDIATE || r.difficulty === DIFFICULTY.ADVANCED) &&
    r.topics.some(topic => 
      highConfTopics.some(highTopic => 
        topic.toLowerCase().includes(highTopic.toLowerCase())
      )
    )
  );
};

/**
 * Get resources for a specific project
 * @param {Array} requiredTopics - Topics needed for project
 * @param {Array} userTopics - User's current topics
 * @returns {Array} - Resources to learn missing topics
 */
export const getResourcesForProject = (requiredTopics, userTopics) => {
  // Find which topics the user doesn't know well
  const weakTopics = requiredTopics.filter(reqTopic => {
    const userTopic = userTopics.find(ut => 
      ut.topicName.toLowerCase().includes(reqTopic.toLowerCase())
    );
    return !userTopic || userTopic.confidence < 4;
  });
  
  if (weakTopics.length === 0) return [];
  
  const resources = getAllResources();
  
  // Find resources that teach these weak topics
  return resources.filter(r => 
    r.topics.some(topic => 
      weakTopics.some(weakTopic => 
        topic.toLowerCase().includes(weakTopic.toLowerCase())
      )
    )
  );
};

// ============================================
// 📊 STATISTICS & ANALYTICS
// ============================================

/**
 * Get resource statistics
 * @returns {Object} - Stats about resources
 */
export const getResourceStats = () => {
  const resources = getAllResources();
  
  const stats = {
    total: resources.length,
    notStarted: resources.filter(r => r.status === RESOURCE_STATUS.NOT_STARTED).length,
    inProgress: resources.filter(r => r.status === RESOURCE_STATUS.IN_PROGRESS).length,
    completed: resources.filter(r => r.status === RESOURCE_STATUS.COMPLETED).length,
    
    byType: {},
    byDifficulty: {},
    
    averageRating: 0,
    totalLearningTime: 0, // minutes
    completedLearningTime: 0
  };
  
  // Count by type
  Object.values(RESOURCE_TYPES).forEach(type => {
    stats.byType[type] = resources.filter(r => r.type === type).length;
  });
  
  // Count by difficulty
  Object.values(DIFFICULTY).forEach(diff => {
    stats.byDifficulty[diff] = resources.filter(r => r.difficulty === diff).length;
  });
  
  // Calculate average rating (only rated resources)
  const ratedResources = resources.filter(r => r.rating !== null);
  if (ratedResources.length > 0) {
    const totalRating = ratedResources.reduce((sum, r) => sum + r.rating, 0);
    stats.averageRating = (totalRating / ratedResources.length).toFixed(1);
  }
  
  // Calculate learning time
  stats.totalLearningTime = resources.reduce((sum, r) => sum + (r.duration || 0), 0);
  stats.completedLearningTime = resources
    .filter(r => r.status === RESOURCE_STATUS.COMPLETED)
    .reduce((sum, r) => sum + (r.duration || 0), 0);
  
  return stats;
};

/**
 * Get completion rate
 * @returns {number} - Percentage (0-100)
 */
export const getCompletionRate = () => {
  const resources = getAllResources();
  if (resources.length === 0) return 0;
  
  const completed = resources.filter(r => r.status === RESOURCE_STATUS.COMPLETED).length;
  return Math.round((completed / resources.length) * 100);
};

/**
 * Get resources completed this week
 * @returns {Array} - Resources completed this week
 */
export const getResourcesCompletedThisWeek = () => {
  const resources = getAllResources();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return resources.filter(r => 
    r.status === RESOURCE_STATUS.COMPLETED &&
    r.dateCompleted &&
    new Date(r.dateCompleted) >= oneWeekAgo
  );
};

/**
 * Get top-rated resources
 * @param {number} limit - Max number to return
 * @returns {Array} - Top-rated resources
 */
export const getTopRatedResources = (limit = 10) => {
  const resources = getAllResources();
  
  return resources
    .filter(r => r.rating !== null)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

/**
 * Get all unique topics from resources
 * @returns {Array} - Array of unique topics
 */
export const getAllTopicsFromResources = () => {
  const resources = getAllResources();
  const topicsSet = new Set();
  
  resources.forEach(r => {
    r.topics.forEach(topic => topicsSet.add(topic));
  });
  
  return Array.from(topicsSet).sort();
};

/**
 * Get all unique tags from resources
 * @returns {Array} - Array of unique tags
 */
export const getAllTags = () => {
  const resources = getAllResources();
  const tagsSet = new Set();
  
  resources.forEach(r => {
    r.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
};

// ============================================
// 🛠️ UTILITY FUNCTIONS
// ============================================

/**
 * Bulk import resources
 * @param {Array} resourcesArray - Array of resource objects
 * @returns {Object} - { success: count, failed: count }
 */
export const bulkImportResources = (resourcesArray) => {
  let success = 0;
  let failed = 0;
  
  resourcesArray.forEach(resource => {
    if (saveResource(resource)) {
      success++;
    } else {
      failed++;
    }
  });
  
  console.log(`📚 Bulk import: ${success} success, ${failed} failed`);
  return { success, failed };
};

/**
 * Clear all resources (for testing/reset)
 */
export const clearAllResources = () => {
  try {
    localStorage.removeItem(RESOURCES_KEY);
    console.log('🧹 All resources cleared!');
    return true;
  } catch (error) {
    console.error('❌ Error clearing resources:', error);
    return false;
  }
};

/**
 * Export resources as JSON (for backup)
 * @returns {string} - JSON string
 */
export const exportResources = () => {
  const data = {
    resources: getAllResources(),
    stats: getResourceStats(),
    exportDate: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
};

/**
 * Get resource type icon/emoji
 * @param {string} type - Resource type
 * @returns {string} - Emoji
 */
export const getResourceTypeIcon = (type) => {
  const icons = {
    [RESOURCE_TYPES.VIDEO]: '🎥',
    [RESOURCE_TYPES.ARTICLE]: '📄',
    [RESOURCE_TYPES.TUTORIAL]: '💻',
    [RESOURCE_TYPES.DATASET]: '📊',
    [RESOURCE_TYPES.TOOL]: '🛠️',
    [RESOURCE_TYPES.PAPER]: '📚',
    [RESOURCE_TYPES.COURSE]: '🎓',
    [RESOURCE_TYPES.DOCUMENTATION]: '📖'
  };
  
  return icons[type] || '📌';
};

/**
 * Format duration for display
 * @param {number} minutes - Duration in minutes
 * @returns {string} - Formatted string
 */
export const formatDuration = (minutes) => {
  if (!minutes) return 'Unknown';
  if (minutes < 60) return `${minutes} min`;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
};

// Default export
export default {
  RESOURCE_TYPES,
  RESOURCE_STATUS,
  DIFFICULTY,
  saveResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  updateResourceStatus,
  markResourceComplete,
  addPersonalNotes,
  rateResource,
  getResourcesByStatus,
  getResourcesByType,
  getResourcesByTopic,
  getResourcesByTag,
  searchResources,
  filterResources,
  getRecommendedResources,
  getAdvancedResources,
  getResourcesForProject,
  getResourceStats,
  getCompletionRate,
  getResourcesCompletedThisWeek,
  getTopRatedResources,
  getAllTopicsFromResources,
  getAllTags,
  bulkImportResources,
  clearAllResources,
  exportResources,
  getResourceTypeIcon,
  formatDuration
};