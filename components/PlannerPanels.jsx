import React from "react";
import { PATTERN_CODES, PATTERN_ORDER, RESULT_SETTINGS } from "../planner/constants";
import { difficultyTone, getLastAttempt } from "../planner/scheduler";
import { ACCENT_COLORS } from "../planner/theme";
import { DailyProblemCard } from "./DailyProblemCard";
import { NumberSetting } from "./NumberSetting";
import { ActionButton, EmptyState, Panel, StatusPill } from "./ui";

export function TodayPanel({ activeLesson, dailyItems, isLessonComplete, markResult, skipProblem, startLesson, state }) {
  if (!activeLesson) {
    return (
      <Panel>
        <div className="terminal-card p-8">
          <p className="terminal-label">lesson process</p>
          <h2 className="terminal-title mt-2 text-3xl">no_active_lesson</h2>
          <p className="theme-muted mt-3 max-w-2xl text-sm">
            Start a lesson when you are ready to practice. Reviews are scheduled by future lesson count, not calendar dates.
          </p>
          <div className="mt-5">
            <ActionButton onClick={startLesson}>Start lesson</ActionButton>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="terminal-title text-2xl">./lesson --id {activeLesson.id}</h2>
          <p className="theme-muted mt-1">
            Target mix: {state.config.newPerDay} new problem{state.config.newPerDay === 1 ? "" : "s"} and {state.config.reviewPerDay} review{state.config.reviewPerDay === 1 ? "" : "s"}.
          </p>
        </div>
        {isLessonComplete ? <ActionButton onClick={startLesson} variant="secondary">Start next lesson</ActionButton> : null}
      </div>

      <div className="space-y-4">
        {dailyItems.length > 0 ? dailyItems.map((item) => (
          <DailyProblemCard key={item.problem.id + "-" + item.kind} item={item} onMark={markResult} onSkip={skipProblem} />
        )) : (
          <EmptyState title="Nothing scheduled today" body="You may have finished the library and cleared the review queue." />
        )}
      </div>
    </Panel>
  );
}

export function BacklogPanel({ lessonNumber, reviewBacklog }) {
  return (
    <Panel>
      <div className="mb-5">
        <h2 className="terminal-title text-2xl">review_backlog.log</h2>
        <p className="theme-muted mt-1">Urgent, overdue, and low-mastery problems rise to the top.</p>
      </div>

      <div className="space-y-3">
        {reviewBacklog.length > 0 ? reviewBacklog.map((problem) => {
          const lastAttempt = getLastAttempt(problem);
          const lastLabel = lastAttempt ? RESULT_SETTINGS[lastAttempt.result].label : "No attempts yet";
          const isDue = problem.dueLesson && problem.dueLesson <= lessonNumber;

          return (
            <article key={problem.id} className="terminal-card grid gap-0 md:grid-cols-[90px_1fr_180px]">
              <div className="border-b p-4 md:border-b-0 md:border-r" style={{ borderColor: "var(--color-border)" }}>
                <p className="terminal-label">pid</p>
                <p className="terminal-title mt-2">{PATTERN_CODES[problem.pattern] || "ALG"}</p>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 p-4 pb-0">
                  <StatusPill>{problem.pattern}</StatusPill>
                  <StatusPill tone={isDue ? "amber" : "neutral"}>{isDue ? "Due" : "Scheduled"}</StatusPill>
                </div>
                <a href={problem.url} target="_blank" rel="noreferrer" className="terminal-prompt theme-link block px-4 pt-2 font-bold underline-offset-4 hover:underline">{problem.title}</a>
                <p className="theme-muted px-4 pb-4 pt-2 text-sm">
                  Due lesson: {problem.dueLesson || "not scheduled"} - Attempts: {problem.attempts.length} - Mastery: {problem.mastery}/10
                </p>
              </div>
              <div className="border-t p-4 md:border-l md:border-t-0" style={{ borderColor: "var(--color-border)" }}>
                <p className="terminal-label">last_result</p>
                <p className="theme-muted mt-2 text-sm">{lastLabel}</p>
              </div>
            </article>
          );
        }) : (
          <EmptyState title="No review backlog yet" body="Complete a problem from today's plan and it will be scheduled for review." />
        )}
      </div>
    </Panel>
  );
}

export function LibraryPanel({ libraryProblems, patternFilter, search, setPatternFilter, setSearch }) {
  return (
    <Panel>
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_260px]">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search problems..."
          className="theme-input border px-4 py-3 font-bold outline-none"
        />
        <select
          value={patternFilter}
          onChange={(event) => setPatternFilter(event.target.value)}
          className="theme-input border px-4 py-3 font-bold outline-none"
        >
          <option value="all">All patterns</option>
          {PATTERN_ORDER.map((pattern) => (
            <option key={pattern} value={pattern}>{pattern}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {libraryProblems.map((problem) => (
          <article key={problem.id} className="terminal-card grid gap-0 md:grid-cols-[90px_1fr_120px]">
            <div className="border-b p-4 md:border-b-0 md:border-r" style={{ borderColor: "var(--color-border)" }}>
              <p className="terminal-label">module</p>
              <p className="terminal-title mt-2">{PATTERN_CODES[problem.pattern] || "ALG"}</p>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill>{problem.pattern}</StatusPill>
                <StatusPill tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</StatusPill>
              </div>
              <a href={problem.url} target="_blank" rel="noreferrer" className="terminal-prompt theme-link mt-2 block font-bold underline-offset-4 hover:underline">{problem.title}</a>
              <p className="theme-muted mt-2 text-sm">Status: {problem.status} - Review lesson: {problem.dueLesson || "not started"}</p>
            </div>
            <div className="border-t p-4 md:border-l md:border-t-0" style={{ borderColor: "var(--color-border)" }}>
              <p className="terminal-label">tries</p>
              <p className="terminal-title mt-2">{problem.attempts.length}</p>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function SettingsPanel({ advancePattern, currentPattern, exportProgressFile, fileStatus, importProgressFile, resetPlanner, state, updateConfig }) {
  function confirmReset() {
    const confirmed = window.confirm("Reset all planner progress? This clears lessons, attempts, review scheduling, and local saved progress.");
    if (confirmed) {
      resetPlanner();
    }
  }

  return (
    <Panel>
      <div className="mb-5">
        <h2 className="terminal-title text-2xl">config.sys</h2>
        <p className="theme-muted mt-1">Tune the daily mix while keeping the planner simple.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <NumberSetting label="Daily total" value={state.config.dailyCount} onChange={(value) => updateConfig("dailyCount", value)} />
        <NumberSetting label="New per day" value={state.config.newPerDay} onChange={(value) => updateConfig("newPerDay", value)} />
        <NumberSetting label="Reviews per day" value={state.config.reviewPerDay} onChange={(value) => updateConfig("reviewPerDay", value)} />
      </div>

      <div className="terminal-card mt-5 p-5">
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div>
            <p className="terminal-label">visual kernel</p>
            <p className="theme-muted mt-1 text-sm">Choose a light or dark base and an accent color.</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                ["light", "Light"],
                ["dark", "Dark"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateConfig("themeBase", value)}
                  className={
                    "px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] transition " +
                    (state.config.themeBase === value ? "theme-tab-active" : "theme-button-outline border")
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((accent) => (
                <button
                  key={accent.value}
                  type="button"
                  onClick={() => updateConfig("accentColor", accent.value)}
                  className={
                    "flex items-center gap-2 border px-3 py-2 text-sm font-bold uppercase tracking-[0.14em] transition " +
                    (state.config.accentColor === accent.value ? "theme-tab-active border-transparent" : "theme-button-outline")
                  }
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: accent.swatch }} />
                  {accent.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-card mt-5 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="terminal-label">current_thread</p>
            <p className="theme-muted mt-1 text-sm">{currentPattern}</p>
          </div>
          <ActionButton onClick={advancePattern}>Advance to next pattern</ActionButton>
        </div>
      </div>

      <div className="terminal-card mt-5 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="terminal-label">state_dump</p>
            <p className="theme-muted mt-1 text-sm">Export a JSON backup or import one from another browser or machine.</p>
            {fileStatus ? <p className="theme-muted mt-2 text-sm">{fileStatus}</p> : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ActionButton onClick={exportProgressFile} variant="secondary">Export JSON</ActionButton>
            <label className="theme-button-outline cursor-pointer border px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] transition">
              Import JSON
              <input type="file" accept="application/json,.json" onChange={importProgressFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div className="terminal-card mt-5 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="terminal-label">danger_zone</p>
            <p className="theme-muted mt-1 text-sm">Clear all local lessons, attempts, review stages, and saved planner state.</p>
          </div>
          <ActionButton onClick={confirmReset} variant="outline">Reset progress</ActionButton>
        </div>
      </div>
    </Panel>
  );
}
