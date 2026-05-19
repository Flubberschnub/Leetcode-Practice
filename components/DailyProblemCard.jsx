import React from "react";
import { PATTERN_CODES, RESULT_SETTINGS } from "../planner/constants";
import { difficultyTone } from "../planner/scheduler";
import { ActionButton, StatusPill } from "./ui";

export function DailyProblemCard({ item, onMark }) {
  const problem = item.problem;
  const attemptThisLesson = item.attemptThisLesson;
  const reviewCopy = item.kind === "review"
    ? "Rebuild the approach from memory before looking at notes."
    : "New problem from the current pattern track.";
  const resultTone = attemptThisLesson?.result === "independent" ? "green" : attemptThisLesson?.result === "hint" ? "amber" : "rose";
  const patternCode = PATTERN_CODES[problem.pattern] || "ALG";
  const memoryAddress = "0x" + (problem.id.length * 4099 + (problem.order || 0) * 257).toString(16).toUpperCase();
  const isLogged = Boolean(attemptThisLesson);

  return (
    <article className={"terminal-card transition " + (isLogged ? "opacity-45 grayscale" : "")}>
      <div className="grid gap-0 lg:grid-cols-[150px_1fr_230px]">
        <div className="border-b p-4 lg:border-b-0 lg:border-r" style={{ borderColor: "var(--color-border)" }}>
          <p className="terminal-label">module</p>
          <p className="terminal-title mt-2 text-2xl">{patternCode}</p>
          <p className="theme-muted mt-2 text-xs">{memoryAddress}</p>
          <p className="matrix-glyphs mt-4 text-xs">0101 1100 0110 0011</p>
        </div>

        <div className="min-w-0 border-b p-4 lg:border-b-0 lg:border-r" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={item.kind === "review" ? "amber" : "blue"}>{item.kind === "review" ? "review" : "new"}</StatusPill>
            <StatusPill>{problem.pattern}</StatusPill>
            <StatusPill tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</StatusPill>
            {isLogged ? <StatusPill tone={resultTone}>logged</StatusPill> : null}
          </div>
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="terminal-prompt theme-link mt-4 block text-xl font-black underline-offset-4 hover:underline md:text-2xl"
          >
            solve("{problem.title}")
          </a>
          <p className="theme-muted mt-3 text-sm">
            {attemptThisLesson ? "Lesson result: " + RESULT_SETTINGS[attemptThisLesson.result].label + ". Review lesson: " + (problem.dueLesson || "not scheduled") + "." : reviewCopy}
          </p>
          {isLogged ? (
            <p className="terminal-code mt-4 inline-block px-3 py-2 text-xs">status=complete write_locked=true</p>
          ) : null}
          {item.kind === "review" && problem.dueLesson ? (
            <p className="terminal-code mt-4 inline-block px-3 py-2 text-xs">due_lesson={problem.dueLesson}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <p className="terminal-label">write_result</p>
          <ActionButton disabled={isLogged} onClick={() => onMark(problem.id, "independent")}>solo</ActionButton>
          <ActionButton disabled={isLogged} onClick={() => onMark(problem.id, "hint")} variant="secondary">hint</ActionButton>
          <ActionButton disabled={isLogged} onClick={() => onMark(problem.id, "solution")} variant="outline">solution</ActionButton>
        </div>
      </div>
    </article>
  );
}
