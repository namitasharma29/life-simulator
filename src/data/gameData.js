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
  { id: 'math-slayer', name: '🥇 Math Slayer', desc: 'Get an A on a math exam', xpReward: 50 },
  { id: 'code-whisperer', name: '🧠 Code Whisperer', desc: 'Finish 3 Python/SQL practice days in a week', xpReward: 40 },
  { id: 'quant-queen', name: '📈 Quant Queen', desc: 'Complete a DS project with visualization', xpReward: 75 },
  { id: 'master-planner', name: '📜 Master Planner', desc: 'Stick to schedule for 7 straight days', xpReward: 30 },
  { id: 'internship-hunter', name: '💼 Internship Hunter', desc: 'Apply to 10+ internships', xpReward: 50 },
  { id: 'researcher-rising', name: '🧪 Researcher Rising', desc: 'Contribute in 3 research meetings', xpReward: 50 },
  { id: 'connector', name: '💬 The Connector', desc: 'Reach out to 3 new people on LinkedIn', xpReward: 25 },
  { id: 'focus-master', name: '🧘 Focus Master', desc: 'No procrastination streak (3 days)', xpReward: 30 },
  { id: '4plus1', name: '🎓 4+1 Candidate', desc: 'Get confirmation of eligibility', xpReward: 100 },
  { id: 'pinterest-path', name: '🏆 Pinterest Pathfounder', desc: 'Land first data science internship', xpReward: 200 },
  { id: 'first-entry', name: '📝 First Reflection', desc: 'Write your first journal entry', xpReward: 25 },
  { id: '3-day-streak', name: '🔥 3-Day Streak', desc: 'Journal 3 days in a row', xpReward: 50 },
  { id: 'week-warrior', name: '🚀 Week Warrior', desc: 'Journal 7 days straight', xpReward: 100 },
  { id: 'insight-hunter', name: '💎 Insight Hunter', desc: 'Write 20 journal entries', xpReward: 150 },
  { id: '30-day-legend', name: '👑 30-Day Legend', desc: 'Maintain a 30-day streak', xpReward: 500 },
  { id: 'first-review', name: '📝 First Review', desc: 'Complete your first weekly review', xpReward: 50 },
  { id: 'consistent-reviewer', name: '🔄 Consistent Reviewer', desc: 'Complete 4 weekly reviews in a row', xpReward: 150 },
  { id: 'growth-mindset', name: '📈 Growth Mindset', desc: 'Boost 3 topic confidences in one week', xpReward: 75 },
  { id: 'resource-collector', name: '📚 Resource Collector', desc: 'Add 10 resources to your library', xpReward: 25 },
  { id: 'scholar', name: '🎓 Scholar', desc: 'Complete 10 resources', xpReward: 100 },
  { id: 'librarian', name: '📖 Librarian', desc: 'Add 50 resources', xpReward: 150 },
  { id: 'knowledge-seeker', name: '🔍 Knowledge Seeker', desc: 'Complete 50 resources', xpReward: 300 }
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
