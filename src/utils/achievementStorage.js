// src/utils/achievementStorage.js
// Manage per-user achievement progress (tiered achievements)

const ACH_PROGRESS_KEY = 'mihikaAchievementProgress';

// Define tiers for selected achievements (3 levels each)
const TIERS = {
  // Resource library related
  'resource-collector': [
    { name: 'Bronze', threshold: 1, xpReward: 25 },
    { name: 'Silver', threshold: 10, xpReward: 50 },
    { name: 'Gold', threshold: 50, xpReward: 150 }
  ],
  'scholar': [
    { name: 'Bronze', threshold: 1, xpReward: 25 },
    { name: 'Silver', threshold: 10, xpReward: 60 },
    { name: 'Gold', threshold: 50, xpReward: 200 }
  ],
  'librarian': [
    { name: 'Bronze', threshold: 5, xpReward: 20 },
    { name: 'Silver', threshold: 25, xpReward: 75 },
    { name: 'Gold', threshold: 50, xpReward: 150 }
  ],
  'knowledge-seeker': [
    { name: 'Bronze', threshold: 1, xpReward: 25 },
    { name: 'Silver', threshold: 10, xpReward: 100 },
    { name: 'Gold', threshold: 50, xpReward: 300 }
  ],

  'journal-warrior': [
    { name: 'Bronze', threshold: 7, xpReward: 50 },
    { name: 'Silver', threshold: 21, xpReward: 150 },
    { name: 'Gold', threshold: 100, xpReward: 500 }
    ],

    'topic-master': [
    { name: 'Bronze', threshold: 10, xpReward: 50 },
    { name: 'Silver', threshold: 30, xpReward: 150 },
    { name: 'Gold', threshold: 100, xpReward: 400 }
    ],

    'interview-ace': [
    { name: 'Bronze', threshold: 10, xpReward: 75 },
    { name: 'Silver', threshold: 50, xpReward: 200 },
    { name: 'Gold', threshold: 100, xpReward: 500 }
    ],

    'project-builder': [
    { name: 'Bronze', threshold: 1, xpReward: 100 },
    { name: 'Silver', threshold: 5, xpReward: 300 },
    { name: 'Gold', threshold: 10, xpReward: 750 }
    ]
};

const load = () => {
  try {
    const raw = localStorage.getItem(ACH_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const save = (obj) => {
  try {
    localStorage.setItem(ACH_PROGRESS_KEY, JSON.stringify(obj));
  } catch (e) {
    // ignore
  }
};

const getProgress = (achievementId) => {
  const all = load();
  return all[achievementId] || { level: 0 };
};

const setProgress = (achievementId, progress) => {
  const all = load();
  all[achievementId] = progress;
  save(all);
};

const hasTiers = (achievementId) => {
  return Object.prototype.hasOwnProperty.call(TIERS, achievementId);
};

const getTiers = (achievementId) => {
  return TIERS[achievementId] || [];
};

/**
 * Advance the level by 1 (if not at max). Returns an object with previous/new level and xp awarded.
 */
const advanceLevel = (achievementId) => {
  if (!hasTiers(achievementId)) return null;
  const tiers = getTiers(achievementId);
  const prog = getProgress(achievementId);
  const prev = prog.level || 0;
  const max = tiers.length;
  if (prev >= max) return { previousLevel: prev, newLevel: prev, xpAwarded: 0, tierName: tiers[max - 1].name, maxLevel: max };

  const newLevel = prev + 1;
  const tierInfo = tiers[newLevel - 1];
  setProgress(achievementId, { level: newLevel });
  return { previousLevel: prev, newLevel, xpAwarded: tierInfo.xpReward, tierName: tierInfo.name, maxLevel: max };
};

const resetAll = () => {
  try {
    localStorage.removeItem(ACH_PROGRESS_KEY);
  } catch (e) {}
};

export default {
  getProgress,
  setProgress,
  advanceLevel,
  hasTiers,
  getTiers,
  resetAll
};
