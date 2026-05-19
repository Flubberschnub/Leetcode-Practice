import React from "react";
import { PATTERN_ORDER, RESULT_SETTINGS } from "../planner/constants";
import { difficultyTone, getLastAttempt } from "../planner/scheduler";
import { ACCENT_COLORS } from "../planner/theme";
import { DailyProblemCard } from "./DailyProblemCard";
import { NumberSetting } from "./NumberSetting";
import { ActionButton, EmptyState, Panel, StatusPill } from "./ui";

export function TodayPanel({ dailyItems, lockTodayPlan, markResult, state, today }) {
  return (
    <Panel>
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Today's plan - {today}</h2>
          <p className="theme-muted mt-1">
            Target mix: {state.config.newPerDay} new problem{state.config.newPerDay === 1 ? "" : "s"} and {state.config.reviewPerDay} review{state.config.reviewPerDay === 1 ? "" : "s"}.
          </p>
        </div>
        <ActionButton onClick={lockTodayPlan} variant="secondary">Lock today's plan</ActionButton>
      </div>

      <div className="space-y-4">
        {dailyItems.length > 0 ? dailyItems.map((item) => (
          <DailyProblemCard key={item.problem.id + "-" + item.kind} item={item} onMark={markResult} />
        )) : (
          <EmptyState title="Nothing scheduled today" body="You may have finished the library and cleared the review queue." />
        )}
      </div>
    </Panel>
  );
}

export function BacklogPanel({ reviewBacklog, today }) {
  return (
    <Panel>
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">Review backlog</h2>
        <p className="theme-muted mt-1">Urgent, overdue, and low-mastery problems rise to the top.</p>
      </div>

      <div className="space-y-3">
        {reviewBacklog.length > 0 ? reviewBacklog.map((problem) => {
          const lastAttempt = getLastAttempt(problem);
          const lastLabel = lastAttempt ? RESULT_SETTINGS[lastAttempt.result].label : "No attempts yet";
          const isDue = problem.dueDate && problem.dueDate <= today;

          return (
            <article key={problem.id} className="theme-subtle flex flex-col gap-3 rounded-3xl border p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <a href={problem.url} target="_blank" rel="noreferrer" className="theme-link font-semibold underline-offset-4 hover:underline">{problem.title}</a>
                  <StatusPill>{problem.pattern}</StatusPill>
                  <StatusPill tone={isDue ? "amber" : "neutral"}>{isDue ? "Due" : "Scheduled"}</StatusPill>
                </div>
                <p className="theme-muted mt-2 text-sm">
                  Due: {problem.dueDate || "not scheduled"} - Attempts: {problem.attempts.length} - Mastery: {problem.mastery}/10
                </p>
              </div>
              <p className="theme-muted text-sm">Last result: {lastLabel}</p>
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
          className="theme-input rounded-2xl border px-4 py-3 outline-none"
        />
        <select
          value={patternFilter}
          onChange={(event) => setPatternFilter(event.target.value)}
          className="theme-input rounded-2xl border px-4 py-3 outline-none"
        >
          <option value="all">All patterns</option>
          {PATTERN_ORDER.map((pattern) => (
            <option key={pattern} value={pattern}>{pattern}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {libraryProblems.map((problem) => (
          <article key={problem.id} className="theme-subtle flex flex-col gap-3 rounded-3xl border p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <a href={problem.url} target="_blank" rel="noreferrer" className="theme-link font-semibold underline-offset-4 hover:underline">{problem.title}</a>
                <StatusPill>{problem.pattern}</StatusPill>
                <StatusPill tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</StatusPill>
              </div>
              <p className="theme-muted mt-2 text-sm">Status: {problem.status} - Next review: {problem.dueDate || "not started"}</p>
            </div>
            <p className="theme-muted text-sm">Attempts: {problem.attempts.length}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function SettingsPanel({ advancePattern, currentPattern, exportProgressFile, fileStatus, importProgressFile, state, updateConfig }) {
  return (
    <Panel>
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">Planner settings</h2>
        <p className="theme-muted mt-1">Tune the daily mix while keeping the planner simple.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <NumberSetting label="Daily total" value={state.config.dailyCount} onChange={(value) => updateConfig("dailyCount", value)} />
        <NumberSetting label="New per day" value={state.config.newPerDay} onChange={(value) => updateConfig("newPerDay", value)} />
        <NumberSetting label="Reviews per day" value={state.config.reviewPerDay} onChange={(value) => updateConfig("reviewPerDay", value)} />
      </div>

      <div className="theme-subtle mt-5 rounded-3xl border p-5">
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div>
            <p className="font-semibold">Theme</p>
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
                    "rounded-2xl px-4 py-2 text-sm font-medium transition " +
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
                    "flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition " +
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

      <div className="theme-subtle mt-5 rounded-3xl border p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">Current lesson track</p>
            <p className="theme-muted mt-1 text-sm">{currentPattern}</p>
          </div>
          <ActionButton onClick={advancePattern}>Advance to next pattern</ActionButton>
        </div>
      </div>

      <div className="theme-subtle mt-5 rounded-3xl border p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">Progress file</p>
            <p className="theme-muted mt-1 text-sm">Export a JSON backup or import one from another browser or machine.</p>
            {fileStatus ? <p className="theme-muted mt-2 text-sm">{fileStatus}</p> : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ActionButton onClick={exportProgressFile} variant="secondary">Export JSON</ActionButton>
            <label className="theme-button-outline cursor-pointer rounded-2xl border px-4 py-2 text-center text-sm font-medium transition">
              Import JSON
              <input type="file" accept="application/json,.json" onChange={importProgressFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </Panel>
  );
}
