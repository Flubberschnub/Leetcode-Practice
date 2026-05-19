import React from "react";
import { PATTERN_CODES, PATTERN_ORDER } from "../planner/constants";

export function PatternSignalMap({ currentPattern }) {
  return (
    <section className="terminal-panel p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="terminal-label">signal map</p>
          <h2 className="terminal-title mt-1 text-xl">pattern_sequence.map</h2>
        </div>
        <p className="terminal-code px-3 py-2 text-xs">active={PATTERN_CODES[currentPattern] || "ALG"}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {PATTERN_ORDER.map((pattern, index) => {
          const isActive = pattern === currentPattern;
          return (
            <div
              key={pattern}
              className={
                "border p-3 " +
                (isActive ? "theme-button-primary" : "terminal-card")
              }
            >
              <p className="text-xs font-black">[{String(index + 1).padStart(2, "0")}] {PATTERN_CODES[pattern]}</p>
              <p className="mt-2 truncate text-xs uppercase tracking-[0.14em]">{pattern}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
