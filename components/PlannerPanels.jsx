import React from "react";
import { PATTERN_ORDER, RESULT_SETTINGS } from "../planner/constants";
import { difficultyTone, getLastAttempt } from "../planner/scheduler";
import { DailyProblemCard } from "./DailyProblemCard";
import { NumberSetting } from "./NumberSetting";
import { ActionButton, EmptyState, Panel, StatusPill } from "./ui";

export function TodayPanel({ dailyItems, lockTodayPlan, markResult, state, today }) {
  return (
    <Panel>
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Today's plan - {today}</h2>
          <p className="mt-1 text-slate-600">
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
        <p className="mt-1 text-slate-600">Urgent, overdue, and low-mastery problems rise to the top.</p>
      </div>

      <div className="space-y-3">
        {reviewBacklog.length > 0 ? reviewBacklog.map((problem) => {
          const lastAttempt = getLastAttempt(problem);
          const lastLabel = lastAttempt ? RESULT_SETTINGS[lastAttempt.result].label : "No attempts yet";
          const isDue = problem.dueDate && problem.dueDate <= today;

          return (
            <article key={problem.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <a href={problem.url} target="_blank" rel="noreferrer" className="font-semibold underline-offset-4 hover:underline">{problem.title}</a>
                  <StatusPill>{problem.pattern}</StatusPill>
                  <StatusPill tone={isDue ? "amber" : "neutral"}>{isDue ? "Due" : "Scheduled"}</StatusPill>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Due: {problem.dueDate || "not scheduled"} - Attempts: {problem.attempts.length} - Mastery: {problem.mastery}/10
                </p>
              </div>
              <p className="text-sm text-slate-500">Last result: {lastLabel}</p>
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
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500"
        />
        <select
          value={patternFilter}
          onChange={(event) => setPatternFilter(event.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500"
        >
          <option value="all">All patterns</option>
          {PATTERN_ORDER.map((pattern) => (
            <option key={pattern} value={pattern}>{pattern}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {libraryProblems.map((problem) => (
          <article key={problem.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <a href={problem.url} target="_blank" rel="noreferrer" className="font-semibold underline-offset-4 hover:underline">{problem.title}</a>
                <StatusPill>{problem.pattern}</StatusPill>
                <StatusPill tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</StatusPill>
              </div>
              <p className="mt-2 text-sm text-slate-600">Status: {problem.status} - Next review: {problem.dueDate || "not started"}</p>
            </div>
            <p className="text-sm text-slate-500">Attempts: {problem.attempts.length}</p>
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
        <p className="mt-1 text-slate-600">Tune the daily mix while keeping the planner simple.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <NumberSetting label="Daily total" value={state.config.dailyCount} onChange={(value) => updateConfig("dailyCount", value)} />
        <NumberSetting label="New per day" value={state.config.newPerDay} onChange={(value) => updateConfig("newPerDay", value)} />
        <NumberSetting label="Reviews per day" value={state.config.reviewPerDay} onChange={(value) => updateConfig("reviewPerDay", value)} />
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">Current lesson track</p>
            <p className="mt-1 text-sm text-slate-600">{currentPattern}</p>
          </div>
          <ActionButton onClick={advancePattern}>Advance to next pattern</ActionButton>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">Progress file</p>
            <p className="mt-1 text-sm text-slate-600">Export a JSON backup or import one from another browser or machine.</p>
            {fileStatus ? <p className="mt-2 text-sm text-slate-500">{fileStatus}</p> : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ActionButton onClick={exportProgressFile} variant="secondary">Export JSON</ActionButton>
            <label className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-50">
              Import JSON
              <input type="file" accept="application/json,.json" onChange={importProgressFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </Panel>
  );
}
