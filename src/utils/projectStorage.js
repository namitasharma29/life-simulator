// ============================================
// PROJECT STORAGE UTILITY
// ============================================

const PROJECTS_KEY = 'mihikaUserProjects';

// ============================================
// PROJECT DATABASE
// ============================================
const PROJECT_TEMPLATES = [
  // BEGINNER TIER
  {
    id: 'exploratory-analysis',
    title: '📊 Exploratory Data Analysis Dashboard',
    difficulty: 'beginner',
    duration: '4-6 hours',
    xpReward: 100,
    tier: 1,
    description: 'Analyze a dataset of your choice using pandas, visualize patterns with matplotlib/seaborn, and document insights.',
    requiredTopics: ['Pandas', 'Matplotlib', 'Descriptive Statistics', 'Data Cleaning'],
    learningOutcomes: ['Data wrangling', 'Statistical analysis', 'Data visualization', 'Storytelling with data'],
    datasets: ['Titanic', 'Netflix Movies', 'Spotify Top Tracks', 'COVID-19 Data'],
    portfolioValue: 3,
    interviewRelevance: 4,
    skills: ['Python', 'EDA', 'Visualization'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'matplotlib', 'jupyter'],
    prerequisites: ['Python basics', 'Statistics 101'],
    domain: 'finance'
  },
  {
    id: 'ab-test-simulation',
    title: '🎯 A/B Test Statistical Analysis',
    difficulty: 'beginner',
    duration: '3-5 hours',
    xpReward: 120,
    tier: 1,
    description: 'Design and analyze an A/B test. Calculate sample size, run hypothesis tests, visualize results, and make recommendations.',
    requiredTopics: ['Hypothesis Testing', 'P-values', 'Confidence Intervals', 'Statistical Significance'],
    learningOutcomes: ['Experimental design', 'Statistical inference', 'Business decision-making'],
    datasets: ['Marketing Campaign Data', 'Website Click Data', 'Product Feature Tests'],
    portfolioValue: 5,
    interviewRelevance: 5,
    skills: ['Statistics', 'A/B Testing', 'Business Analytics'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'scipy', 'jupyter'],
    prerequisites: ['Statistics 101'],
    domain: 'marketing'
  },
  {
    id: 'sql-business-metrics',
    title: '💼 SQL Business Metrics Dashboard',
    difficulty: 'beginner',
    duration: '4-6 hours',
    xpReward: 100,
    tier: 1,
    description: 'Write complex SQL queries to calculate KPIs (retention, churn, LTV). Use window functions and CTEs.',
    requiredTopics: ['SQL', 'Window Functions', 'CTEs', 'Joins'],
    learningOutcomes: ['Advanced SQL', 'Metric definition', 'Business analytics'],
    datasets: ['E-commerce Orders', 'User Activity Logs', 'Subscription Data'],
    portfolioValue: 4,
    interviewRelevance: 5,
    skills: ['SQL', 'Analytics', 'Metrics'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['SQL', 'PostgreSQL', 'Jupyter'],
    prerequisites: ['SQL Basics'],
    domain: 'ecommerce'
  },

  // INTERMEDIATE TIER
  {
    id: 'regression-predictor',
    title: '🏠 Price Prediction Model (Regression)',
    difficulty: 'intermediate',
    duration: '8-12 hours',
    xpReward: 200,
    tier: 2,
    description: 'Build a linear/polynomial regression model. Feature engineering, regularization (Ridge/Lasso), cross-validation, and interpretation.',
    requiredTopics: ['Linear Regression', 'Feature Engineering', 'Cross-Validation', 'Regularization', 'Model Evaluation'],
    learningOutcomes: ['Supervised learning', 'Feature selection', 'Model tuning', 'Interpretation'],
    datasets: ['House Prices', 'Car Prices', 'Salary Prediction', 'Stock Prices'],
    portfolioValue: 4,
    interviewRelevance: 5,
    skills: ['Machine Learning', 'Regression', 'scikit-learn'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'scikit-learn', 'matplotlib'],
    prerequisites: ['Python basics', 'Statistics 101'],
    domain: 'real-estate'
  },
  {
    id: 'classification-churn',
    title: '🔮 Customer Churn Prediction',
    difficulty: 'intermediate',
    duration: '10-15 hours',
    xpReward: 250,
    tier: 2,
    description: 'Build logistic regression and decision tree classifiers. Handle imbalanced data, tune hyperparameters, evaluate with precision/recall.',
    requiredTopics: ['Logistic Regression', 'Decision Trees', 'Class Imbalance', 'ROC-AUC', 'Precision-Recall'],
    learningOutcomes: ['Classification', 'Imbalanced data handling', 'Model evaluation', 'Business impact'],
    datasets: ['Telecom Churn', 'Bank Customer Churn', 'Subscription Cancellations'],
    portfolioValue: 5,
    interviewRelevance: 5,
    skills: ['Classification', 'Imbalanced Data', 'Business Metrics'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'scikit-learn', 'imbalanced-learn'],
    prerequisites: ['Python basics', 'Statistics 101'],
    domain: 'telecom'
  },
  {
    id: 'clustering-segmentation',
    title: '👥 Customer Segmentation (Clustering)',
    difficulty: 'intermediate',
    duration: '8-12 hours',
    xpReward: 200,
    tier: 2,
    description: 'Use K-Means or hierarchical clustering to segment customers. Determine optimal K, visualize clusters, interpret segments.',
    requiredTopics: ['K-Means', 'Hierarchical Clustering', 'Elbow Method', 'Silhouette Score', 'PCA'],
    learningOutcomes: ['Unsupervised learning', 'Dimensionality reduction', 'Business segmentation'],
    datasets: ['Customer Transaction Data', 'Marketing Campaign Data', 'User Behavior Logs'],
    portfolioValue: 4,
    interviewRelevance: 4,
    skills: ['Clustering', 'Unsupervised Learning', 'Segmentation'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'scikit-learn', 'matplotlib'],
    prerequisites: ['Python basics', 'Statistics 101'],
    domain: 'marketing'
  },

  // ADVANCED TIER
  {
    id: 'recommender-system',
    title: '🎬 Content Recommendation Engine',
    difficulty: 'advanced',
    duration: '15-20 hours',
    xpReward: 350,
    tier: 3,
    description: 'Build collaborative filtering (user-based, item-based) and content-based recommenders. Evaluate with RMSE, precision@K.',
    requiredTopics: ['Collaborative Filtering', 'Matrix Factorization', 'Cosine Similarity', 'Recommendation Metrics'],
    learningOutcomes: ['RecSys algorithms', 'Sparse matrices', 'Evaluation metrics', 'Cold start problem'],
    datasets: ['MovieLens', 'Amazon Products', 'Spotify Songs', 'Book Ratings'],
    portfolioValue: 5,
    interviewRelevance: 5,
    skills: ['Recommendation Systems', 'Collaborative Filtering', 'RecSys'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'scikit-learn', 'surprise'],
    prerequisites: ['Python basics', 'Linear Algebra'],
    domain: 'entertainment'
  },
  {
    id: 'nlp-sentiment',
    title: '💬 Sentiment Analysis Pipeline',
    difficulty: 'advanced',
    duration: '12-18 hours',
    xpReward: 300,
    tier: 3,
    description: 'Build NLP pipeline for sentiment classification. Use TF-IDF, word embeddings, and LSTM. Compare multiple models.',
    requiredTopics: ['NLP', 'Text Preprocessing', 'TF-IDF', 'Word Embeddings', 'Neural Networks'],
    learningOutcomes: ['NLP techniques', 'Deep learning basics', 'Model comparison', 'Real-world text data'],
    datasets: ['Twitter Sentiment', 'Product Reviews', 'Movie Reviews', 'News Headlines'],
    portfolioValue: 5,
    interviewRelevance: 4,
    skills: ['NLP', 'Deep Learning', 'Text Analysis'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'nltk', 'scikit-learn', 'tensorflow'],
    prerequisites: ['Python basics', 'Linear Algebra'],
    domain: 'social-media'
  },
  {
    id: 'time-series-forecast',
    title: '📈 Time Series Forecasting System',
    difficulty: 'advanced',
    duration: '15-20 hours',
    xpReward: 350,
    tier: 3,
    description: 'Build ARIMA, Prophet, or LSTM models for forecasting. Handle seasonality, trends, and anomaly detection.',
    requiredTopics: ['Time Series Analysis', 'ARIMA', 'Seasonality', 'Stationarity', 'Forecasting'],
    learningOutcomes: ['Time series modeling', 'Forecasting techniques', 'Anomaly detection'],
    datasets: ['Stock Prices', 'Sales Forecasting', 'Web Traffic', 'Energy Consumption'],
    portfolioValue: 5,
    interviewRelevance: 4,
    skills: ['Time Series', 'Forecasting', 'Prophet/ARIMA'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'statsmodels', 'prophet'],
    prerequisites: ['Python basics', 'Statistics 101'],
    domain: 'finance'
  },

  // CHALLENGE TIER
  {
    id: 'end-to-end-ml',
    title: '🚀 End-to-End ML Pipeline (Production)',
    difficulty: 'challenge',
    duration: '25-40 hours',
    xpReward: 500,
    tier: 4,
    description: 'Build, deploy, and monitor a full ML system. Include CI/CD, model versioning, API, monitoring dashboard, and A/B testing.',
    requiredTopics: ['MLOps', 'Model Deployment', 'Docker', 'FastAPI', 'Model Monitoring', 'A/B Testing'],
    learningOutcomes: ['Production ML', 'DevOps', 'API design', 'Monitoring', 'Real-world deployment'],
    datasets: ['Choose your own domain'],
    portfolioValue: 5,
    interviewRelevance: 5,
    skills: ['MLOps', 'Production ML', 'Deployment'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['docker', 'fastapi', 'scikit-learn'],
    prerequisites: ['Python basics', 'Docker 101'],
    domain: 'varied'
  },
  {
    id: 'causal-inference',
    title: '🔬 Causal Inference Study',
    difficulty: 'challenge',
    duration: '20-30 hours',
    xpReward: 450,
    tier: 4,
    description: 'Design and analyze a causal study. Use propensity score matching, difference-in-differences, or instrumental variables.',
    requiredTopics: ['Causal Inference', 'Propensity Scores', 'Difference-in-Differences', 'Instrumental Variables'],
    learningOutcomes: ['Causal methods', 'Observational studies', 'Treatment effects', 'Bias correction'],
    datasets: ['Policy Evaluation', 'Marketing Interventions', 'Healthcare Studies'],
    portfolioValue: 5,
    interviewRelevance: 5,
    skills: ['Causal Inference', 'Econometrics', 'Research Design'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['pandas', 'statsmodels', 'scikit-learn'],
    prerequisites: ['Python basics', 'Statistics 101'],
    domain: 'healthcare'
  },
  {
    id: 'deep-learning-vision',
    title: '👁️ Computer Vision Classifier',
    difficulty: 'challenge',
    duration: '20-30 hours',
    xpReward: 450,
    tier: 4,
    description: 'Build a CNN for image classification. Use transfer learning (ResNet, VGG), data augmentation, and model interpretability.',
    requiredTopics: ['Deep Learning', 'CNNs', 'Transfer Learning', 'Image Processing', 'Model Interpretability'],
    learningOutcomes: ['Computer vision', 'Neural networks', 'Transfer learning', 'GPU training'],
    datasets: ['CIFAR-10', 'Fashion MNIST', 'Medical Images', 'Satellite Images'],
    portfolioValue: 5,
    interviewRelevance: 4,
    skills: ['Deep Learning', 'Computer Vision', 'TensorFlow/PyTorch'],
    gitHubLink: 'https://github.com/namitasharma29/project-name',
    youtubeLink: null,
    estimatedCost: 'free',
    tools: ['tensorflow', 'keras', 'opencv'],
    prerequisites: ['Python basics', 'Linear Algebra'],
    domain: 'healthcare'
  }
];

// ============================================
// RECOMMENDATION ALGORITHM
// ============================================
const calculateProjectMatch = (project, userTopics) => {
  if (!userTopics || userTopics.length === 0) {
    return { matchScore: 0, knownTopics: [], newTopics: project.requiredTopics, readinessScore: 0 };
  }

  const userTopicNames = userTopics.map(t => t.topicName.toLowerCase());
  const userTopicConfidence = {};
  userTopics.forEach(t => {
    userTopicConfidence[t.topicName.toLowerCase()] = t.confidence;
  });

  const knownTopics = [];
  const newTopics = [];

  project.requiredTopics.forEach(reqTopic => {
    const reqLower = reqTopic.toLowerCase();
    const isKnown = userTopicNames.some(userTopic => 
      userTopic.includes(reqLower) || reqLower.includes(userTopic)
    );

    if (isKnown) {
      knownTopics.push(reqTopic);
    } else {
      newTopics.push(reqTopic);
    }
  });

  const overlapRatio = knownTopics.length / project.requiredTopics.length;
  
  // Calculate weighted confidence (higher confidence topics boost score)
  let totalConfidence = 0;
  let confidenceCount = 0;
  knownTopics.forEach(topic => {
    const topicLower = topic.toLowerCase();
    const matchingUserTopic = userTopics.find(ut => 
      ut.topicName.toLowerCase().includes(topicLower) || topicLower.includes(ut.topicName.toLowerCase())
    );
    if (matchingUserTopic) {
      totalConfidence += matchingUserTopic.confidence;
      confidenceCount++;
    }
  });
  const avgConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;

  // Readiness score (0-100):
  // - 60-80% known topics is ideal
  // - Average confidence 3-5 is good
  // - Too easy or too hard gets penalized
  let readinessScore = 0;
  if (overlapRatio >= 0.6 && overlapRatio <= 0.8) {
    readinessScore = 100;
  } else if (overlapRatio >= 0.4 && overlapRatio < 0.6) {
    readinessScore = 80; // Stretch project
  } else if (overlapRatio > 0.8) {
    readinessScore = 60; // Too easy
  } else {
    readinessScore = 40; // Too hard
  }

  // Boost if confidence is high (3-5)
  const confidenceBoost = avgConfidence >= 3 ? 1.2 : 1.0;
  
  const matchScore = Math.round(overlapRatio * 100 * confidenceBoost);

  return {
    matchScore,
    knownTopics,
    newTopics,
    readinessScore,
    overlapRatio,
    avgConfidence: avgConfidence.toFixed(1)
  };
};

const getRecommendedProjects = (userTopics, limit = 6, userLevel = 1) => {
  // If no topics logged, recommend by difficulty tier
  if (!userTopics || userTopics.length === 0) {
    const byDifficulty = PROJECT_TEMPLATES.filter(p => p.tier === userLevel);
    return byDifficulty.slice(0, limit);
  }
  
  // Otherwise, use existing match logic
  // Calculate match for all projects
  const scored = PROJECT_TEMPLATES.map(project => {
    const match = calculateProjectMatch(project, userTopics);
    return {
      ...project,
      ...match
    };
  });

  // Sort by readiness score (prioritize ideal difficulty)
  scored.sort((a, b) => {
    if (b.readinessScore !== a.readinessScore) {
      return b.readinessScore - a.readinessScore;
    }
    return b.matchScore - a.matchScore;
  });

  return scored.slice(0, limit);
};

// ============================================
// STORAGE FUNCTIONS
// ============================================

/**
 * Save a project (user-initiated)
 * @param {Object} project - Project data { projectId, startDate, githubLink, status, reflection, xpEarned }
 */
const saveProject = (project) => {
  try {
    const projects = getUserProjects();
    const existing = projects.findIndex(p => p.projectId === project.projectId);

    if (existing >= 0) {
      projects[existing] = { ...projects[existing], ...project, updatedAt: Date.now() };
    } else {
      projects.push({
        ...project,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return true;
  } catch (e) {
    console.error('Error saving project:', e);
    return false;
  }
};

/**
 * Get a single project by ID
 */
const getProject = (projectId) => {
  try {
    const projects = getUserProjects();
    return projects.find(p => p.projectId === projectId) || null;
  } catch (e) {
    return null;
  }
};

/**
 * Get all projects user has attempted
 */
const getUserProjects = () => {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Mark project complete and award XP
 * @param {string} projectId - Project template ID
 * @param {Object} metadata - { githubLink, reflection, duration }
 * @returns {Object} - { success, xpEarned }
 */
const completeProject = (projectId, metadata = {}) => {
  try {
    const template = PROJECT_TEMPLATES.find(p => p.id === projectId);
    if (!template) return { success: false, xpEarned: 0 };

    const project = {
      projectId,
      status: 'completed',
      completedAt: Date.now(),
      githubLink: metadata.githubLink || '',
      reflection: metadata.reflection || '',
      actualDuration: metadata.duration || template.duration,
      xpEarned: template.xpReward
    };

    saveProject(project);
    return { success: true, xpEarned: template.xpReward };
  } catch (e) {
    return { success: false, xpEarned: 0 };
  }
};

/**
 * Get project stats
 */
const getProjectStats = () => {
  try {
    const projects = getUserProjects();
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status === 'in-progress').length;
    const total = projects.length;
    const totalXpEarned = projects.reduce((sum, p) => sum + (p.xpEarned || 0), 0);

    return { completed, inProgress, total, totalXpEarned };
  } catch (e) {
    return { completed: 0, inProgress: 0, total: 0, totalXpEarned: 0 };
  }
};

/**
 * Get projects by difficulty level
 */
const getProjectsByDifficulty = (difficulty) => {
  return PROJECT_TEMPLATES.filter(p => p.difficulty === difficulty);
};

/**
 * Delete a project
 */
const deleteProject = (projectId) => {
  try {
    const projects = getUserProjects();
    const filtered = projects.filter(p => p.projectId !== projectId);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Reset all projects
 */
const resetAllProjects = () => {
  try {
    localStorage.removeItem(PROJECTS_KEY);
    return true;
  } catch (e) {
    return false;
  }
};

export default {
  PROJECT_TEMPLATES,
  calculateProjectMatch,
  getRecommendedProjects,
  saveProject,
  getProject,
  getUserProjects,
  completeProject,
  getProjectStats,
  getProjectsByDifficulty,
  deleteProject,
  resetAllProjects
};