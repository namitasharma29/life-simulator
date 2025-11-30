// Utilities for generating journal prompts (logic only)
import journalPrompts from '../data/journalPrompts';
import topicStorage from './topicStorage';

// Helper function to get a random prompt from any category
export const getRandomPrompt = () => {
  // If there are topics saved, sometimes return a topic-aware prompt
  try {
    const allTopics = topicStorage.getAllTopics();
    if (allTopics && allTopics.length > 0 && Math.random() < 0.25) {
      const chooser = Math.random();
      if (chooser < 0.5) return getTopicPrompt();
      return getTopicConnectionPrompt();
    }
  } catch (e) {
    // ignore and fall back to static prompts
  }

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

// -----------------------------
// Topic-aware prompt generators
// -----------------------------

export const getTopicPrompt = () => {
  const topic = topicStorage.getRandomTopicForPrompt();
  if (!topic) return getRandomPrompt();

  const prompt = `Write about "${topic.topicName}"${topic.course ? ` (Course: ${topic.course})` : ''}: summarize the core idea, give one concrete example, and list one question you still have.`;
  return { prompt, category: 'topic' };
};

export const getTopicConnectionPrompt = () => {
  const pair = topicStorage.getRandomTopicPair();
  if (!pair || pair.length < 2) return getRandomPrompt();

  const [a, b] = pair;
  const prompt = `How might "${a.topicName}" and "${b.topicName}" be connected? Describe a scenario or project that uses both.`;
  return { prompt, category: 'connections' };
};

export const getReviewPrompt = () => {
  const low = topicStorage.getLowConfidenceTopics();
  if (!low || low.length === 0) return getRandomPrompt();

  const topic = low[Math.floor(Math.random() * low.length)];
  const prompt = `You're low on confidence with "${topic.topicName}". List 3 concrete steps you can take to improve, including a small practice task.`;
  return { prompt, category: 'confidence' };
};

export const getCoursePrompt = (courseName) => {
  const topics = topicStorage.getTopicsByCourse(courseName || '');
  if (!topics || topics.length === 0) return getRandomPrompt();

  const topic = topics[Math.floor(Math.random() * topics.length)];
  const prompt = `Pick "${topic.topicName}" from ${courseName || topic.course}. Summarize it and create one practice problem.`;
  return { prompt, category: 'application' };
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
