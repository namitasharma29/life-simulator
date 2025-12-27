/**
 * COURSE DATA
 * 
 * Ground truth mapping of Purdue courses to skills.
 * Each course unlocks one or more skills.
 * 
 * Status:
 * - "COMPLETED": You finished this course (has a grade)
 * - "IN_PROGRESS": Currently taking this semester
 * - "PLANNED": Future course
 */

export const COURSE_STATUS = {
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
  PLANNED: "PLANNED"
};

export const MY_COURSES = [
  
  // ==================== COMPLETED COURSES ====================
  
  // Fall 2023
  {
    id: "MA-26100",
    code: "MA 26100",
    name: "Multivariate Calculus",
    semester: "Fall 2023",
    credits: 4,
    grade: "B+",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: [] // Calculus is prerequisite for many things, but not a direct skill we're tracking
  },
  
  // Spring 2024
  {
    id: "CS-18000",
    code: "CS 18000",
    name: "Problem Solving & OO Programming",
    semester: "Spring 2024",
    credits: 4,
    grade: "C",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: ["programming-fundamentals"] // Java, but unlocks general programming
  },
  {
    id: "MA-35100",
    code: "MA 35100",
    name: "Elementary Linear Algebra",
    semester: "Spring 2024",
    credits: 3,
    grade: "C",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: ["linear-algebra"]
  },
  
  // Fall 2024
  {
    id: "CS-18200",
    code: "CS 18200",
    name: "Foundations of Computer Science",
    semester: "Fall 2024",
    credits: 3,
    grade: "B+",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: [] // Discrete math/logic, not directly a DS skill
  },
  {
    id: "MA-37500",
    code: "MA 37500",
    name: "Introduction to Discrete Mathematics",
    semester: "Fall 2024",
    credits: 3,
    grade: "A-",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: [] // Graph theory, combinatorics - useful but not core DS
  },
  {
    id: "STAT-35000",
    code: "STAT 35000",
    name: "Introduction to Statistics",
    semester: "Fall 2024",
    credits: 3,
    grade: "C+",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: [] // Intro stats, too basic - real skills come from 41600+
  },
  
  // Spring 2025
  {
    id: "MA-34100",
    code: "MA 34100",
    name: "Foundations of Analysis",
    semester: "Spring 2025",
    credits: 3,
    grade: "B",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: [] // Real analysis - mathematical maturity, not direct DS skill
  },
  {
    id: "MA-36600",
    code: "MA 36600",
    name: "Ordinary Differential Equations",
    semester: "Spring 2025",
    credits: 4,
    grade: "B-",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: [] // ODEs - not core DS
  },
  
  // Fall 2025
  {
    id: "CS-31400",
    code: "CS 31400",
    name: "Numerical Methods",
    semester: "Fall 2025",
    credits: 3,
    grade: "B",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: [] // Numerical computing, somewhat relevant but not core
  },
  {
    id: "STAT-41600",
    code: "STAT 41600",
    name: "Probability",
    semester: "Fall 2025",
    credits: 3,
    grade: "B+",
    status: COURSE_STATUS.COMPLETED,
    skillsUnlocked: ["probability"] // 🎯 CRITICAL UNLOCK
  },
  
  // ==================== SPRING 2026 (IN PROGRESS) ====================
  
  {
    id: "STAT-51200",
    code: "STAT 51200",
    name: "Applied Regression Analysis",
    semester: "Spring 2026",
    credits: 3,
    grade: null,
    status: COURSE_STATUS.IN_PROGRESS,
    skillsUnlocked: ["regression-analysis", "feature-engineering"], // 🎯 CRITICAL UNLOCKS
    progressPercent: 0.0 // Week 0 of 16
  },
  {
    id: "STAT-41700",
    code: "STAT 41700",
    name: "Statistical Theory",
    semester: "Spring 2026",
    credits: 3,
    grade: null,
    status: COURSE_STATUS.IN_PROGRESS,
    skillsUnlocked: ["statistical-inference"], // 🎯 HIGH VALUE
    progressPercent: 0.0
  },
  {
    id: "MA-34900",
    code: "MA 34900",
    name: "Signals and Systems for Math",
    semester: "Spring 2026",
    credits: 3,
    grade: null,
    status: COURSE_STATUS.IN_PROGRESS,
    skillsUnlocked: [], // Signal processing - not core DS
    progressPercent: 0.0
  },
  {
    id: "MA-34990",
    code: "MA 34990",
    name: "Data Science Labs: Signals & Systems",
    semester: "Spring 2026",
    credits: 1,
    grade: null,
    status: COURSE_STATUS.IN_PROGRESS,
    skillsUnlocked: [], // Lab component
    progressPercent: 0.0
  },
  {
    id: "COM-21700",
    code: "COM 21700",
    name: "Science Writing and Presentation",
    semester: "Spring 2026",
    credits: 3,
    grade: null,
    status: COURSE_STATUS.IN_PROGRESS,
    skillsUnlocked: ["data-storytelling"], // 🎯 HIGH VALUE for Pinterest
    progressPercent: 0.0
  },
  
  // ==================== PLANNED (FUTURE) ====================
  // Add your planned Fall 2026 / Spring 2027 courses here when you know them
  
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get all completed courses
 */
export function getCompletedCourses() {
  return MY_COURSES.filter(course => course.status === COURSE_STATUS.COMPLETED);
}

/**
 * Get courses currently in progress
 */
export function getInProgressCourses() {
  return MY_COURSES.filter(course => course.status === COURSE_STATUS.IN_PROGRESS);
}

/**
 * Get course by ID
 */
export function getCourseById(courseId) {
  return MY_COURSES.find(course => course.id === courseId);
}

/**
 * Get all skills unlocked by completed courses
 */
export function getUnlockedSkills() {
  const completed = getCompletedCourses();
  const skills = new Set(); // Use Set to avoid duplicates
  
  completed.forEach(course => {
    course.skillsUnlocked.forEach(skill => skills.add(skill));
  });
  
  return Array.from(skills); // Convert Set back to Array
}

/**
 * Get all skills being unlocked by current semester
 */
export function getSkillsInProgress() {
  const inProgress = getInProgressCourses();
  const skills = new Set();
  
  inProgress.forEach(course => {
    course.skillsUnlocked.forEach(skill => skills.add(skill));
  });
  
  return Array.from(skills);
}