// 🎲 Brain Dump Roulette - Prompts Database
// Categorized prompts to keep journaling fresh and meaningful

const journalPrompts = {
  // 🤔 CONFUSION CRUSHERS - Address what's fuzzy
  confusion: [
    "What confused you most today? Explain in 20 words or less.",
    "If you could ask your professor ONE question right now, what would it be?",
    "What concept feels like it's *almost* clicking but not quite?",
    "Name one thing that made you say 'wait, what?' today.",
    "What topic do you need to revisit this week?",
    "Which formula or concept do you keep forgetting? Why do you think that is?",
    "What's one assumption you made that turned out to be wrong?",
  ],

  // 💡 AHA MOMENTS - Celebrate understanding
  aha: [
    "What clicked today that didn't make sense before?",
    "Describe your biggest 'aha!' moment this week in one sentence.",
    "What finally makes sense now that you wish you understood sooner?",
    "When did you feel smartest today?",
    "What connection did you make that surprised you?",
    "Finish this: 'I never realized that _____ actually means _____!'",
    "What concept went from 'scary' to 'oh, that's it?' today?",
  ],

  // 🔗 CONNECTION MAKERS - Link concepts together
  connections: [
    "How does today's topic connect to something you learned last week?",
    "What's the real-world Pinterest use case for today's concept?",
    "How could you use this at a tech company like Pinterest or Meta?",
    "Connect today's math/stats to a data science application.",
    "If you were building a recommendation system, where would today's topic fit?",
    "What CS concept relates to today's math topic?",
    "How does this relate to a dataset you've worked with?",
    "What ML algorithm uses today's concept under the hood?",
  ],

  // 🎯 APPLICATION FOCUSED - Make it practical
  application: [
    "How would you explain today's topic to a non-technical friend?",
    "What problem could you solve with what you learned today?",
    "Design a mini-project using today's concept. What would you build?",
    "If you had to teach this to a beginner, what example would you use?",
    "What Kaggle dataset would be perfect for practicing this?",
    "How would you use this in an A/B test at Pinterest?",
    "Write one SQL query or Python snippet that demonstrates today's concept.",
    "What interview question could test this concept?",
  ],

  // 😊 CONFIDENCE CHECK - Self-awareness
  confidence: [
    "Rate your confidence on today's topic (1-5). Why that number?",
    "What would bump your confidence up by one point?",
    "What topic are you most confident about right now?",
    "What skill improved the most this week?",
    "Finish this: 'I used to struggle with _____ but now I can _____.'",
    "What's one thing you can do now that you couldn't do a month ago?",
    "On a scale of 1-10, how ready do you feel for interviews? Why?",
  ],

  // 🧠 FEYNMAN LITE - Simplify to understand
  feynman: [
    "Explain today's hardest concept using only simple words (no jargon!).",
    "How would you explain this concept using only emojis? Try it!",
    "If you had to explain this to a 10-year-old, what would you say?",
    "What's the ELI5 (Explain Like I'm 5) version of today's topic?",
    "Break down today's concept into 3 simple steps.",
    "What analogy would you use to explain today's topic?",
    "Draw or describe a visual representation of today's concept.",
  ],

  // 🎓 STUDY REFLECTION - Optimize learning
  study: [
    "What study method worked best for you today?",
    "If you could redo today's study session, what would you change?",
    "What time of day did you feel most productive?",
    "What distraction did you overcome today?",
    "What helped you focus today?",
    "Rate today's productivity (1-5). What drove that rating?",
    "What's one habit that's helping your learning?",
  ],

  // 🚀 FUTURE FOCUSED - Goal setting
  future: [
    "What's one skill you want to build this week?",
    "What topic do you want to master by the end of the month?",
    "How will today's learning help you at Pinterest?",
    "What's the next step in your data science journey?",
    "What project idea excited you today?",
    "How does today's work get you closer to your internship goal?",
    "What will 'future you' thank 'present you' for doing today?",
  ],

  // 💪 MOTIVATION BOOSTERS - Stay inspired
  motivation: [
    "What made you proud today, even if it was small?",
    "What's one win you had today (big or tiny)?",
    "Why did you choose data science? Remind yourself.",
    "What excites you most about working at Pinterest someday?",
    "Who inspires you in the DS field? What can you learn from them?",
    "What's the coolest thing about data science to you?",
    "Finish this: 'I'm becoming the kind of person who _____.'",
  ],
};

// Helper function to get a random prompt from any category
export const getRandomPrompt = () => {
  const categories = Object.keys(journalPrompts);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const prompts = journalPrompts[randomCategory];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
  return {
    prompt: randomPrompt,
    category: randomCategory,
  };
};

// Helper function to get a prompt for a specific category
export const getPromptByCategory = (category) => {
  const prompts = journalPrompts[category];
  if (!prompts) return getRandomPrompt();
  
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  return {
    prompt: randomPrompt,
    category: category,
  };
};

// Get daily prompt (same prompt for the whole day based on date)
export const getDailyPrompt = () => {
  const today = new Date().toDateString();
  const saved = localStorage.getItem('dailyJournalPrompt');
  const savedDate = localStorage.getItem('dailyJournalPromptDate');
  
  // If we already have today's prompt, return it
  if (saved && savedDate === today) {
    return JSON.parse(saved);
  }
  
  // Otherwise, generate a new one and save it
  const newPrompt = getRandomPrompt();
  localStorage.setItem('dailyJournalPrompt', JSON.stringify(newPrompt));
  localStorage.setItem('dailyJournalPromptDate', today);
  
  return newPrompt;
};

export default journalPrompts;