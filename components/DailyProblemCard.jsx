import React from "react";
import { RESULT_SETTINGS } from "../planner/constants";
import { difficultyTone } from "../planner/scheduler";
import { ActionButton, StatusPill } from "./ui";

export function DailyProblemCard({ item, onMark }) {
  const problem = item.problem;
  const attemptToday = item.attemptToday;
  const reviewCopy = item.kind === "review"
    ? "Rebuild the approach from memory before looking at notes."
    : "New problem from the current pattern track.";
  const resultTone = attemptToday?.result === "independent" ? "green" : attemptToday?.result === "hint" ? "amber" : "rose";

  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={item.kind === "review" ? "amber" : "blue"}>{item.kind === "review" ? "Review" : "New"}</StatusPill>
            <StatusPill>{problem.pattern}</StatusPill>
            <StatusPill tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</StatusPill>
            {attemptToday ? <StatusPill tone={resultTone}>Completed today</StatusPill> : null}
          </div>

          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-xl font-semibold text-slate-950 underline-offset-4 hover:underline"
          >
            {problem.title}
          </a>

          <p className="mt-2 text-sm text-slate-600">
            {attemptToday ? "Today's result: " + RESULT_SETTINGS[attemptToday.result].label + ". Next review: " + (problem.dueDate || "not scheduled") + "." : reviewCopy}
          </p>
          {item.kind === "review" && problem.dueDate ? (
            <p className="mt-1 text-sm text-slate-500">Due date: {problem.dueDate}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <ActionButton onClick={() => onMark(problem.id, "independent")}>{attemptToday ? "Set solo" : "Solved solo"}</ActionButton>
          <ActionButton onClick={() => onMark(problem.id, "hint")} variant="secondary">{attemptToday ? "Set hint" : "Used hint"}</ActionButton>
          <ActionButton onClick={() => onMark(problem.id, "solution")} variant="outline">{attemptToday ? "Set solution" : "Needed solution"}</ActionButton>
        </div>
      </div>
    </article>
  );
}
