# Topic Storage & Dynamic Prompts Integration Guide

## Overview
Your learning topics from `topicStorage.js` are now fully integrated with the journal system. Topics drive personalized prompts with intelligent weighting based on **recency** and **confidence level**.

---

## How It Works

### 1. **Topic Weighting System**
Topics are selected using a weighted algorithm that considers:
- **Recency**: Newer topics (≤7 days) appear 3x more often; 8–14 days: 2x; 15–21 days: 1x; 21+ days: 0.5x
- **Confidence**: Lower confidence topics (1–5 scale) are inversely weighted so you review weak areas more

**Formula**: `composite_weight = recency_weight × confidence_weight`

Example:
- A 3-day-old topic with confidence 2: `3 × (6-2) = 12` weight multiplier
- A 10-day-old topic with confidence 5: `2 × (6-5) = 2` weight multiplier
- The first topic is 6x more likely to appear in prompts

---

## Key Files Modified

### `src/utils/topicStorage.js`
- **`getRandomTopicForPrompt()`** - Returns a weighted random topic for journal prompts
- **`getRandomTopicPair()`** - Returns two related topics for connection prompts
- Considers topics up to 21 days old for reinforcement

### `src/data/journalPrompts.js`
- **`getTopicPrompt()`** - Generates a prompt focused on a single saved topic
- **`getTopicConnectionPrompt()`** - Generates a prompt connecting two topics
- **`getReviewPrompt()`** - Generates a prompt for low-confidence topics
- **`getCoursePrompt(courseName)`** - Generates a prompt for a specific course
- **`getRandomPrompt()`** - Now returns topic-based prompts 25% of the time if topics exist

### `src/components/JournalModal.js`
- Updated to use topic-based prompts when available
- 50% chance to show a topic prompt if topics exist
- 40% of those are "review prompts" for low-confidence topics
- Tracks whether a journal entry came from a topic-based prompt

### `src/App.js`
- Imported `topicStorage`
- Added `TopicLogger` component to the UI
- Logs topic-based journal entries for analytics

### `src/components/TopicLogger.js` (NEW)
- UI component to log, view, and manage learning topics
- Features:
  - Add new topics with course, confidence, notes, tags
  - View this week's topics
  - Delete topics
  - Real-time confidence visualization

---

## How to Use

### Adding Topics
1. Click **"+ Log Topic"** button in the Learning Topics section
2. Fill in:
   - **Topic Name** (required, e.g., "Linear Algebra Basics")
   - **Course** (optional, e.g., "MA 279")
   - **Confidence** (1-5 slider, default 3)
   - **Notes** (optional, e.g., "Need to practice eigenvectors")
   - **Tags** (optional, comma-separated, e.g., "math, linear-algebra")
3. Click **"Save Topic"**

### Topics Appear in Prompts
Once you have topics logged:
- 50% of daily journal prompts will be **topic-based** (if you have topics)
- Your low-confidence topics appear more frequently
- Recent topics are prioritized over older ones
- Topics fade out around 3 weeks old (but can still appear for reinforcement)

### Prompt Types
When a topic appears in a journal prompt, you'll see:
- **Single Topic Prompt**: "Write about [topic]... summarize the core idea..."
- **Connection Prompt**: "How might [topic1] and [topic2] be connected?..."
- **Review Prompt**: "You're low on confidence with [topic]. List 3 concrete steps..."

---

## Example Workflow

**Monday, Nov 13:**
- Log "Linear Algebra" (confidence 2, course MA 279)
- Log "Eigenvectors" (confidence 1, course MA 279)
- Log "Probability Basics" (confidence 4, course STAT 416)

**Tuesday, Nov 14:**
- Journal prompt: "You're low on confidence with 'Eigenvectors'..." (because confidence=1)
- Write your entry → +10 XP

**Wednesday, Nov 15:**
- Journal prompt: "How might 'Linear Algebra' and 'Probability Basics' be connected?..."
- Write your entry → +10 XP

**Following Week:**
- Topics still appear but less frequently (recency weight drops)
- After 21 days, topics rarely appear (backup reinforcement only)

---

## API Reference

### From `topicStorage`
```javascript
import topicStorage from './utils/topicStorage';

// Save a new topic
topicStorage.saveTopic({
  course: "MA 279",
  topicName: "Linear Algebra",
  confidence: 3, // 1-5
  notes: "Need to review determinants",
  tags: ["math", "linear-algebra"]
});

// Get topics by various filters
topicStorage.getRandomTopicForPrompt() // Weighted by recency + confidence
topicStorage.getRandomTopicPair() // Two related topics
topicStorage.getLowConfidenceTopics() // Topics with confidence ≤ 3
topicStorage.getTopicsByCourse("MA 279")
topicStorage.getRecentTopics(7) // Last 7 days

// Update confidence
topicStorage.updateTopicConfidence(topicId, 4)

// Delete topic
topicStorage.deleteTopic(topicId)
```

### From `journalPrompts`
```javascript
import { 
  getTopicPrompt, 
  getReviewPrompt, 
  getTopicConnectionPrompt,
  getCoursePrompt 
} from './data/journalPrompts';

// All return { prompt: string, category: string }
const prompt1 = getTopicPrompt();
const prompt2 = getReviewPrompt();
const prompt3 = getTopicConnectionPrompt();
const prompt4 = getCoursePrompt("MA 279");
```

---

## Stats & Monitoring

Topics support analytics:
```javascript
topicStorage.getTopicCountByCourse() // { "MA 279": 5, "STAT 416": 3 }
topicStorage.getAverageConfidence() // "3.2" (across recent topics)
topicStorage.getWeeklyProgress() // { thisWeek: 5, lastWeek: 3 }
topicStorage.exportTopics() // Full JSON export with stats
```

---

## Customization

### Adjust Weighting
Edit the recency weights in `getRandomTopicForPrompt()`:
```javascript
let recencyWeight = 0;
if (daysAgo <= 7) recencyWeight = 3; // Change 3 to tune
else if (daysAgo <= 14) recencyWeight = 2;
else if (daysAgo <= 21) recencyWeight = 1;
else recencyWeight = 0.5;
```

### Change Topic Prompt Frequency
In `JournalModal.js`:
```javascript
if (allTopics && allTopics.length > 0 && Math.random() < 0.5) {
  // Change 0.5 to adjust frequency (0.5 = 50%)
}
```

### Adjust Review Prompt Frequency
```javascript
if (lowConfidenceTopics && lowConfidenceTopics.length > 0 && Math.random() < 0.4) {
  // Change 0.4 to tune (0.4 = 40% of topic prompts)
}
```

---

## Next Steps

1. **Log topics** via the TopicLogger component
2. **Update confidence** after studying (if you implement an update UI)
3. **Track which prompts help most** (optional: add analytics)
4. **Evolve weighting** based on what feels right for your learning

Happy learning! 🚀
