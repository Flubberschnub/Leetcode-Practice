import { DEFAULT_CONFIG, PATTERN_ORDER, RESULT_SETTINGS } from "./constants";

export function getLastAttempt(problem) {
  if (!problem.attempts || problem.attempts.length === 0) return null;
  return problem.attempts[problem.attempts.length - 1];
}

export function getAttemptForDate(problem, date) {
  if (!problem.attempts || problem.attempts.length === 0) return null;
  return [...problem.attempts].reverse().find((attempt) => attempt.date === date) || null;
}

export function getAttemptForLesson(problem, lessonId) {
  if (!problem.attempts || problem.attempts.length === 0) return null;
  return [...problem.attempts].reverse().find((attempt) => attempt.lessonId === lessonId) || null;
}

export function difficultyRank(difficulty) {
  if (difficulty === "Easy") return 1;
  if (difficulty === "Medium") return 2;
  return 3;
}

export function difficultyTone(difficulty) {
  if (difficulty === "Easy") return "green";
  if (difficulty === "Medium") return "amber";
  return "rose";
}

function patternRank(pattern) {
  const index = PATTERN_ORDER.indexOf(pattern);
  return index === -1 ? PATTERN_ORDER.length : index;
}

export function reviewPriority(problem, lessonNumber) {
  if (!problem.dueLesson) return -999999;

  const overdueDays = Math.max(0, lessonNumber - problem.dueLesson);
  const weaknessBoost = Math.max(0, 5 - problem.mastery);
  return overdueDays * 10 + weaknessBoost + problem.attempts.length;
}

export function generatePlan(state, lessonNumber) {
  const existingLesson = state.lessons?.[lessonNumber];
  if (existingLesson?.plan) {
    return existingLesson.plan;
  }

  const config = state.config || DEFAULT_CONFIG;
  const dailyCount = Math.max(1, config.dailyCount || DEFAULT_CONFIG.dailyCount);
  const reviewTarget = Math.min(dailyCount, Math.max(0, config.reviewPerDay || 0));
  const newTarget = Math.min(dailyCount, Math.max(0, config.newPerDay || 0));
  const currentPattern = PATTERN_ORDER[config.currentPatternIndex] || PATTERN_ORDER[0];

  const allDueReviews = state.problems
    .filter((problem) => problem.status !== "unseen" && problem.dueLesson && problem.dueLesson <= lessonNumber)
    .sort((a, b) => reviewPriority(b, lessonNumber) - reviewPriority(a, lessonNumber));

  const dueReviews = allDueReviews.slice(0, reviewTarget);
  const availableNewSlots = Math.max(0, dailyCount - dueReviews.length);
  const missingReviewSlots = Math.max(0, reviewTarget - dueReviews.length);
  const newSlots = Math.min(availableNewSlots, newTarget + missingReviewSlots);

  const patternNewProblems = state.problems
    .filter((problem) => problem.status === "unseen" && problem.pattern === currentPattern)
    .sort((a, b) => {
      const difficultyDiff = difficultyRank(a.difficulty) - difficultyRank(b.difficulty);
      if (difficultyDiff !== 0) return difficultyDiff;
      return (a.order || 0) - (b.order || 0);
    })
    .slice(0, newSlots);

  let chosenNewProblems = [...patternNewProblems];

  if (chosenNewProblems.length < newSlots) {
    const fallbackProblems = state.problems
      .filter((problem) => {
        if (problem.status !== "unseen") return false;
        return !chosenNewProblems.some((chosen) => chosen.id === problem.id);
      })
      .sort((a, b) => {
        const patternDiff = patternRank(a.pattern) - patternRank(b.pattern);
        if (patternDiff !== 0) return patternDiff;
        const difficultyDiff = difficultyRank(a.difficulty) - difficultyRank(b.difficulty);
        if (difficultyDiff !== 0) return difficultyDiff;
        return (a.order || 0) - (b.order || 0);
      })
      .slice(0, newSlots - chosenNewProblems.length);

    chosenNewProblems = [...chosenNewProblems, ...fallbackProblems];
  }

  const chosenIds = new Set([...chosenNewProblems, ...dueReviews].map((problem) => problem.id));
  const extraReviews = allDueReviews
    .filter((problem) => !chosenIds.has(problem.id))
    .slice(0, Math.max(0, dailyCount - chosenNewProblems.length - dueReviews.length));

  return [...chosenNewProblems, ...dueReviews, ...extraReviews]
    .slice(0, dailyCount)
    .map((problem) => ({
      problemId: problem.id,
      kind: problem.status === "unseen" ? "new" : "review",
    }));
}

export function getNextReviewUpdate(problem, result, lessonNumber) {
  const settings = RESULT_SETTINGS[result];
  const stage = Math.max(0, Math.min(problem.reviewStage || 0, settings.intervals.length - 1));
  const intervalIndex = result === "solution" ? 0 : stage;
  const interval = settings.intervals[intervalIndex];
  const nextStage = Math.max(0, Math.min(stage + settings.stageShift, settings.intervals.length - 1));

  return {
    reviewStage: nextStage,
    dueLesson: lessonNumber + interval,
    dueDate: null,
    mastery: Math.max(0, Math.min(10, (problem.mastery || 0) + settings.masteryGain)),
  };
}

export function calculateStats(problems, lessonNumber) {
  const started = problems.filter((problem) => problem.status !== "unseen").length;
  const due = problems.filter((problem) => problem.status !== "unseen" && problem.dueLesson && problem.dueLesson <= lessonNumber).length;
  const mastered = problems.filter((problem) => problem.mastery >= 6).length;

  return { started, due, mastered };
}
