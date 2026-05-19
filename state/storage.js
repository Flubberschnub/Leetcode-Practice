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
    dueDate: null,
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
      dueDate: saved.dueDate || null,
      lastAttemptDate: saved.lastAttemptDate || null,
    };
  });
}

function normalizeDailyPlans(dailyPlans = {}) {
  return Object.fromEntries(
    Object.entries(dailyPlans).map(([date, entries]) => [
      date,
      Array.isArray(entries)
        ? entries.map((entry) => ({
            ...entry,
            problemId: normalizeProblemId(entry.problemId),
          }))
        : [],
    ])
  );
}

export function createInitialState() {
  return {
    config: { ...DEFAULT_CONFIG },
    problems: cloneProblemLibrary(),
    dailyPlans: {},
  };
}

export function loadState() {
  if (typeof window === "undefined") return createInitialState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);

    if (!parsed || !Array.isArray(parsed.problems) || !parsed.config) {
      return createInitialState();
    }

    return {
      config: { ...DEFAULT_CONFIG, ...parsed.config },
      problems: mergeProblemsWithLibrary(parsed.problems),
      dailyPlans: normalizeDailyPlans(parsed.dailyPlans),
    };
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
