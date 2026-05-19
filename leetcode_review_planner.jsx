import React, { useEffect, useMemo, useState } from "react";
import { BacklogPanel, LibraryPanel, SettingsPanel, TodayPanel } from "./components/PlannerPanels";
import { PatternSignalMap } from "./components/PatternSignalMap";
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
import { getThemeStyle } from "./planner/theme";
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
  const themeStyle = useMemo(() => getThemeStyle(state.config), [state.config]);

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
    <main className="theme-root cyber-root min-h-screen p-4 md:p-8" style={themeStyle}>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="terminal-panel p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="blue">LC_REVIEW_OS</StatusPill>
                <span className="terminal-code px-3 py-1 text-xs">session={today}</span>
              </div>
              <h1 className="terminal-title mt-4 text-4xl md:text-6xl">
                Wake up, practice patterns.
              </h1>
              <p className="theme-muted mt-4 max-w-3xl text-sm leading-7">
                <span className="terminal-prompt">boot lesson planner</span><br />
                ingest NeetCode 150, schedule recall probes, write result states, repeat until pattern recognition compiles.
              </p>
              <a href={NEETCODE_150_URL} target="_blank" rel="noreferrer" className="theme-link mt-3 inline-block text-sm font-medium underline-offset-4 hover:underline">
                source://neetcode150
              </a>
            </div>
            <ActionButton onClick={resetPlanner} variant="outline">Reset progress</ActionButton>
          </div>
          <div className="terminal-divider mt-6" />
          <p className="matrix-glyphs mt-4 text-xs">00101100 11001010 01010111 10001100 01110010 00011101 11010001 01100110 10101010</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Current pattern" value={currentPattern} helper="New problems come from this lesson track." />
          <StatCard label="Problems started" value={stats.started + "/" + state.problems.length} helper="Started means attempted at least once." />
          <StatCard label="Due for review" value={String(stats.due)} helper="Overdue reviews rise to the top." />
          <StatCard label="Mastery 6+" value={String(stats.mastered)} helper="A rough signal of durable recall." />
        </section>

        <PatternSignalMap currentPattern={currentPattern} />

        <nav className="terminal-panel flex flex-wrap gap-2 p-2">
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
                "px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition " +
                (activeTab === value ? "theme-tab-active" : "theme-tab")
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
