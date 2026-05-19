import React from "react";

export function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "theme-pill-neutral",
    blue: "theme-pill-accent",
    green: "border-green-400 bg-green-950 text-green-300",
    amber: "border-amber-400 bg-amber-950 text-amber-300",
    rose: "border-rose-400 bg-rose-950 text-rose-300",
  };

  return (
    <span className={"inline-flex items-center border px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] " + tones[tone]}>
      {children}
    </span>
  );
}

export function Panel({ children, className = "" }) {
  return <section className={"terminal-panel p-5 " + className}>{children}</section>;
}

export function ActionButton({ children, disabled = false, onClick, variant = "primary" }) {
  const variants = {
    primary: "theme-button-primary",
    secondary: "theme-button-secondary",
    outline: "theme-button-outline border",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={"px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-40 " + variants[variant]}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="terminal-card border border-dashed p-8 text-center">
      <p className="terminal-title">{title}</p>
      <p className="theme-muted mt-2 text-sm">{body}</p>
    </div>
  );
}
