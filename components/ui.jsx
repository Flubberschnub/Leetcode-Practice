import React from "react";

export function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "theme-pill-neutral",
    blue: "theme-pill-accent",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={"inline-flex items-center rounded-full px-3 py-1 text-xs font-medium " + tones[tone]}>
      {children}
    </span>
  );
}

export function Panel({ children, className = "" }) {
  return <section className={"theme-surface rounded-3xl border p-5 " + className}>{children}</section>;
}

export function ActionButton({ children, onClick, variant = "primary" }) {
  const variants = {
    primary: "theme-button-primary",
    secondary: "theme-button-secondary",
    outline: "theme-button-outline border",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={"rounded-2xl px-4 py-2 text-sm font-medium transition " + variants[variant]}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="theme-subtle rounded-3xl border border-dashed p-8 text-center">
      <p className="theme-strong font-medium">{title}</p>
      <p className="theme-muted mt-2 text-sm">{body}</p>
    </div>
  );
}
