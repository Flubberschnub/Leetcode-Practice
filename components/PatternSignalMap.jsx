import React from "react";
import { PATTERN_CODES, PATTERN_ORDER } from "../planner/constants";

export function PatternSignalMap({ activeLessonPattern, currentPattern, onSelectPattern }) {
  return (
    <section className="terminal-panel p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="terminal-label">signal map</p>
          <h2 className="terminal-title mt-1 text-xl">pattern_sequence.map</h2>
          <p className="theme-muted mt-1 text-sm">Click a module to route the next lesson's new problems. Review backlog remains global.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeLessonPattern ? <p className="terminal-code px-3 py-2 text-xs">running={PATTERN_CODES[activeLessonPattern] || "ALG"}</p> : null}
          <p className="terminal-code px-3 py-2 text-xs">next={PATTERN_CODES[currentPattern] || "ALG"}</p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {PATTERN_ORDER.map((pattern, index) => {
          const isSelected = pattern === currentPattern;
          const isRunning = pattern === activeLessonPattern;
          return (
            <button
              key={pattern}
              type="button"
              onClick={() => onSelectPattern(pattern)}
              className={
                "border p-3 text-left transition hover:border-[var(--accent-strong)] " +
                (isSelected ? "theme-button-primary" : "terminal-card")
              }
            >
              <p className="text-xs font-black">[{String(index + 1).padStart(2, "0")}] {PATTERN_CODES[pattern]}</p>
              <p className="mt-2 truncate text-xs uppercase tracking-[0.14em]">{pattern}</p>
              {isRunning ? <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.18em]">running</p> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
