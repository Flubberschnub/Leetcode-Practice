import { NEETCODE_PROBLEMS } from "../data/neetcode150";
import { DEFAULT_CONFIG, STORAGE_KEY } from "../planner/constants";

const LEGACY_ID_MAP = {
  "two-sum-ii": "two-sum-ii-input-array-is-sorted",
  "container-most-water": "container-with-most-water",
  "best-time-buy-sell-stock": "best-time-to-buy-and-sell-stock",
  "longest-substring-without-repeating": "longest-substring-without-repeating-characters",
  "evaluate-rpn": "evaluate-reverse-polish-notation",
};

export function cloneProblemLibrary() {
  return NEETCODE_PROBLEMS.map((problem) => ({
    ...problem,
    status: "unseen",
    attempts: [],
    reviewStage: 0,
    mastery: 0,
    dueLesson: null,
    dueDate: null,
    lastAttemptLesson: null,
    lastAttemptDate: null,
  }));
}

function normalizeProblemId(problemId) {
  return LEGACY_ID_MAP[problemId] || problemId;
}

function mergeProblemsWithLibrary(savedProblems = []) {
  const savedById = new Map(savedProblems.map((problem) => [normalizeProblemId(problem.id), problem]));

  return cloneProblemLibrary().map((libraryProblem) => {
    const saved = savedById.get(libraryProblem.id);
    if (!saved) return libraryProblem;

    return {
      ...libraryProblem,
      status: saved.status || libraryProblem.status,
      attempts: Array.isArray(saved.attempts) ? saved.attempts : [],
      reviewStage: Number.isFinite(saved.reviewStage) ? saved.reviewStage : 0,
      mastery: Number.isFinite(saved.mastery) ? saved.mastery : 0,
      dueLesson: Number.isFinite(saved.dueLesson) ? saved.dueLesson : saved.dueDate ? 1 : null,
      dueDate: saved.dueDate || null,
      lastAttemptLesson: Number.isFinite(saved.lastAttemptLesson) ? saved.lastAttemptLesson : null,
      lastAttemptDate: saved.lastAttemptDate || null,
    };
  });
}

function normalizePlanEntries(entries = []) {
  return Array.isArray(entries)
    ? entries.map((entry) => ({
        ...entry,
        problemId: normalizeProblemId(entry.problemId),
      }))
    : [];
}

function normalizeLessons(lessons = {}) {
  return Object.fromEntries(
    Object.entries(lessons).map(([lessonId, lesson]) => [
      lessonId,
      {
        ...lesson,
        id: Number(lesson.id || lessonId),
        plan: normalizePlanEntries(lesson.plan),
      },
    ])
  );
}

function normalizeSavedState(savedState) {
  if (!savedState || !Array.isArray(savedState.problems) || !savedState.config) {
    return null;
  }

  return {
    config: { ...DEFAULT_CONFIG, ...savedState.config },
    problems: mergeProblemsWithLibrary(savedState.problems),
    lessons: normalizeLessons(savedState.lessons),
    activeLessonId: Number.isFinite(savedState.activeLessonId) ? savedState.activeLessonId : null,
    lessonCounter: Number.isFinite(savedState.lessonCounter) ? savedState.lessonCounter : 0,
    dailyPlans: {},
  };
}

export function createInitialState() {
  return {
    config: { ...DEFAULT_CONFIG },
    problems: cloneProblemLibrary(),
    lessons: {},
    activeLessonId: null,
    lessonCounter: 0,
    dailyPlans: {},
  };
}

export function loadState() {
  if (typeof window === "undefined") return createInitialState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return normalizeSavedState(parsed) || createInitialState();
  } catch (error) {
    return createInitialState();
  }
}

export function saveState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetSavedState() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function serializeStateFile(state) {
  return JSON.stringify(
    {
      app: "leetcode-review-planner",
      version: 1,
      exportedAt: new Date().toISOString(),
      state,
    },
    null,
    2
  );
}

export function parseStateFile(fileText) {
  const parsed = JSON.parse(fileText);
  const savedState = parsed && parsed.state ? parsed.state : parsed;
  const normalized = normalizeSavedState(savedState);

  if (!normalized) {
    throw new Error("The selected file is not a valid planner progress file.");
  }

  return normalized;
}
