import React, { useEffect, useMemo, useState } from "react";
import { BacklogPanel, LibraryPanel, SettingsPanel, TodayPanel } from "./components/PlannerPanels";
import { StatCard } from "./components/StatCard";
import { ActionButton, StatusPill } from "./components/ui";
import { NEETCODE_150_URL, PATTERN_ORDER } from "./planner/constants";
import {
  calculateStats,
  generatePlan,
  getAttemptForDate,
  getLastAttempt,
  getNextReviewUpdate,
  reviewPriority,
} from "./planner/scheduler";
import { createInitialState, loadState, parseStateFile, resetSavedState, saveState, serializeStateFile } from "./state/storage";
import { getToday } from "./utils/date";

export default function LeetCodeReviewPlanner() {
  const [state, setState] = useState(() => loadState());
  const [activeTab, setActiveTab] = useState("today");
  const [fileStatus, setFileStatus] = useState("");
  const [search, setSearch] = useState("");
  const [patternFilter, setPatternFilter] = useState("all");

  const today = getToday();

  useEffect(() => {
    saveState(state);
  }, [state]);

  const plan = useMemo(() => generatePlan(state, today), [state, today]);
  const dailyItems = plan
    .map((entry) => {
      const problem = state.problems.find((candidate) => candidate.id === entry.problemId);
      return {
        ...entry,
        problem,
        attemptToday: problem ? getAttemptForDate(problem, today) : null,
      };
    })
    .filter((entry) => entry.problem);

  const stats = calculateStats(state.problems, today);
  const currentPattern = PATTERN_ORDER[state.config.currentPatternIndex] || PATTERN_ORDER[0];

  const reviewBacklog = [...state.problems]
    .filter((problem) => problem.status !== "unseen")
    .sort((a, b) => reviewPriority(b, today) - reviewPriority(a, today));

  const libraryProblems = state.problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
    const matchesPattern = patternFilter === "all" || problem.pattern === patternFilter;
    return matchesSearch && matchesPattern;
  });

  function lockTodayPlan() {
    setState((previous) => {
      if (previous.dailyPlans[today]) return previous;
      return {
        ...previous,
        dailyPlans: {
          ...previous.dailyPlans,
          [today]: plan,
        },
      };
    });
  }

  function markResult(problemId, result) {
    setState((previous) => {
      const existingPlan = previous.dailyPlans[today] || plan;
      return {
        ...previous,
        dailyPlans: {
          ...previous.dailyPlans,
          [today]: existingPlan,
        },
        problems: previous.problems.map((problem) => {
          if (problem.id !== problemId) return problem;

          const lastAttempt = getLastAttempt(problem);
          const replacingToday = lastAttempt && lastAttempt.date === today;
          const baseProblem = replacingToday
            ? {
                ...problem,
                reviewStage: Number.isFinite(lastAttempt.previousReviewStage) ? lastAttempt.previousReviewStage : Math.max(0, (problem.reviewStage || 0) - 1),
                mastery: Number.isFinite(lastAttempt.previousMastery) ? lastAttempt.previousMastery : problem.mastery || 0,
              }
            : problem;
          const next = getNextReviewUpdate(baseProblem, result, today);
          const nextAttempt = {
            date: today,
            result,
            previousReviewStage: baseProblem.reviewStage || 0,
            previousMastery: baseProblem.mastery || 0,
          };

          return {
            ...problem,
            status: "reviewing",
            attempts: replacingToday ? [...problem.attempts.slice(0, -1), nextAttempt] : [...problem.attempts, nextAttempt],
            lastAttemptDate: today,
            reviewStage: next.reviewStage,
            dueDate: next.dueDate,
            mastery: next.mastery,
          };
        }),
      };
    });
  }

  function updateConfig(key, value) {
    setState((previous) => ({
      ...previous,
      config: {
        ...previous.config,
        [key]: value,
      },
    }));
  }

  function advancePattern() {
    setState((previous) => ({
      ...previous,
      config: {
        ...previous.config,
        currentPatternIndex: Math.min(PATTERN_ORDER.length - 1, previous.config.currentPatternIndex + 1),
      },
    }));
  }

  function resetPlanner() {
    resetSavedState();
    setFileStatus("");
    setState(createInitialState());
  }

  function exportProgressFile() {
    const blob = new Blob([serializeStateFile(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "leetcode-review-planner-" + today + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setFileStatus("Exported progress file for " + today + ".");
  }

  async function importProgressFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileText = await file.text();
      const importedState = parseStateFile(fileText);
      setState(importedState);
      setFileStatus("Imported " + file.name + ".");
    } catch (error) {
      setFileStatus(error instanceof Error ? error.message : "Could not import that progress file.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-950 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <StatusPill tone="blue">LeetCode review planner</StatusPill>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Three curated problems a day, with spaced reviews that adapt.
              </h1>
              <p className="mt-4 max-w-3xl text-slate-600">
                Practice a small number of new problems from one NeetCode 150 pattern while revisiting older problems based on whether you solved them solo, needed a hint, or needed the solution.
              </p>
              <a href={NEETCODE_150_URL} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-slate-700 underline-offset-4 hover:underline">
                Problem source: NeetCode 150
              </a>
            </div>
            <ActionButton onClick={resetPlanner} variant="outline">Reset progress</ActionButton>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Current pattern" value={currentPattern} helper="New problems come from this lesson track." />
          <StatCard label="Problems started" value={stats.started + "/" + state.problems.length} helper="Started means attempted at least once." />
          <StatCard label="Due for review" value={String(stats.due)} helper="Overdue reviews rise to the top." />
          <StatCard label="Mastery 6+" value={String(stats.mastered)} helper="A rough signal of durable recall." />
        </section>

        <nav className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
          {[
            ["today", "Today's plan"],
            ["backlog", "Review backlog"],
            ["library", "Problem library"],
            ["settings", "Settings"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              className={
                "rounded-2xl px-4 py-2 text-sm font-medium transition " +
                (activeTab === value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100")
              }
            >
              {label}
            </button>
          ))}
        </nav>

        {activeTab === "today" ? (
          <TodayPanel
            dailyItems={dailyItems}
            lockTodayPlan={lockTodayPlan}
            markResult={markResult}
            state={state}
            today={today}
          />
        ) : null}

        {activeTab === "backlog" ? <BacklogPanel reviewBacklog={reviewBacklog} today={today} /> : null}

        {activeTab === "library" ? (
          <LibraryPanel
            libraryProblems={libraryProblems}
            patternFilter={patternFilter}
            search={search}
            setPatternFilter={setPatternFilter}
            setSearch={setSearch}
          />
        ) : null}

        {activeTab === "settings" ? (
          <SettingsPanel
            advancePattern={advancePattern}
            currentPattern={currentPattern}
            exportProgressFile={exportProgressFile}
            fileStatus={fileStatus}
            importProgressFile={importProgressFile}
            state={state}
            updateConfig={updateConfig}
          />
        ) : null}
      </div>
    </main>
  );
}
