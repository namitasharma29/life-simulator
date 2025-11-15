// =========================
// 🎯 LEVELS — Progression Path
// =========================
export const levels = [
  { level: 1, title: "The Analyst Apprentice", phase: "🧩 Foundation", goal: "Build GPA, core math/stats base", xpRequired: 0 },
  { level: 2, title: "Data Alchemist", phase: "🧠 Growth", goal: "Strengthen DS + coding + intuition", xpRequired: 500 },
  { level: 3, title: "Internship Seeker", phase: "💼 Launch", goal: "Land data-related internship", xpRequired: 1000 },
  { level: 4, title: "Pinterest Pathfinder", phase: "🚀 Career Entry", goal: "Secure DS role / grad school offer", xpRequired: 1500 },
  { level: 5, title: "Product Strategist", phase: "🏢 Leadership", goal: "Transition to management & strategy", xpRequired: 2000 },
  { level: 6, title: "Visionary of Pinterest", phase: "👑 Data Scientist", goal: "Build, lead, inspire", xpRequired: 2500 }
];

// =========================
// 🏅 ACHIEVEMENTS — Milestones
// =========================
export const achievementsList = [
  { id: 'resource-collector', name: '📚 Resource Collector', desc: 'Add 10 resources to your library', xpReward: 25 },
  { id: 'scholar', name: '🎓 Scholar', desc: 'Complete 10 resources', xpReward: 100 },
  { id: 'librarian', name: '📖 Librarian', desc: 'Add 50 resources', xpReward: 150 },
  { id: 'knowledge-seeker', name: '🔍 Knowledge Seeker', desc: 'Complete 50 resources', xpReward: 300 },  
  { id: 'journal-warrior', name: '🔥 Journal Streak', desc: 'Maintain daily journaling streak', xpReward: 50 },
  { id: 'topic-master', name: '📚 Topic Master', desc: 'Log topics you\'re learning', xpReward: 30 },
  { id: 'interview-ace', name: '🎯 Interview Ready', desc: 'Practice interview questions', xpReward: 50 },
  { id: 'project-builder', name: '🏗️ Project Builder', desc: 'Complete data science projects', xpReward: 100 }
];

// =========================
// 🧠 QUEST POOLS — Daily Task Generator
// =========================
export const questPools = {
  // 🎓 Course-related
  courses: [
    { text: 'Watch 1 MA 303 lecture video', xp: 8, skill: 'academic' },
    { text: 'Do 1 MA 279 problem', xp: 6, skill: 'academic' },
    { text: 'Complete 1 STAT 416 exercise', xp: 8, skill: 'academic' },
    { text: 'Read 1 week of ECON 340 slides', xp: 6, skill: 'academic' },
    { text: 'Watch 1 CS 314 lecture video', xp: 8, skill: 'tech' }
  ],

  // 🤖 Data Science & ML Skills
  data_ml: [
    { text: 'Do 30 mins Python pandas practice', xp: 10, skill: 'tech' },
    { text: 'Implement a small ML simulation', xp: 15, skill: 'tech' },
    { text: 'Solve 1 SQL window function problem', xp: 12, skill: 'tech' },
    { text: 'Train a logistic regression model', xp: 15, skill: 'tech' }
  ],

  // 🔬 Research & Knowledge Growth
  research: [
    { text: 'Read a Pinterest engineering blog post', xp: 12, skill: 'career' },
    { text: 'Read a recsys paper (30–45 min)', xp: 15, skill: 'academic' },
    { text: 'Summarize a paper in 200 words', xp: 10, skill: 'academic' }
  ],

  // 🧘‍♀️ Balance & Well-being
  life_balance: [
    { text: 'Plan your week (15 min)', xp: 5, skill: 'balance' },
    { text: 'Take a 20-min walk', xp: 5, skill: 'balance' },
    { text: 'Meditate 10 minutes', xp: 5, skill: 'balance' }
  ],

  // 💼 Career Development
  career: [
    { text: 'Apply to 1 internship', xp: 10, skill: 'career' },
    { text: 'Update LinkedIn profile', xp: 8, skill: 'networking' },
    { text: 'Reach out to 1 person on LinkedIn', xp: 10, skill: 'networking' },
    { text: 'Attend a networking event', xp: 15, skill: 'networking' }
  ]
};

// =========================
// 🌈 EXPORT EVERYTHING
// =========================
export default {
  levels,
  achievementsList,
  questPools
};
