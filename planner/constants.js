export const STORAGE_KEY = "leetcode-review-planner-v2";
export const NEETCODE_150_URL = "https://neetcode.io/practice/practice/neetcode150";

export const PATTERN_ORDER = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Heap / Priority Queue",
  "Backtracking",
  "Tries",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
];

export const DEFAULT_CONFIG = {
  dailyCount: 3,
  newPerDay: 2,
  reviewPerDay: 1,
  currentPatternIndex: 0,
  themeBase: "light",
  accentColor: "blue",
};

export const RESULT_SETTINGS = {
  independent: {
    label: "Solved without help",
    shortLabel: "Solved solo",
    intervals: [3, 7, 21, 45],
    stageShift: 1,
    masteryGain: 2,
  },
  hint: {
    label: "Solved with hint",
    shortLabel: "Used hint",
    intervals: [2, 5, 14, 30],
    stageShift: 0,
    masteryGain: 1,
  },
  solution: {
    label: "Needed solution",
    shortLabel: "Needed solution",
    intervals: [1, 2, 4, 7],
    stageShift: -1,
    masteryGain: -2,
  },
};
