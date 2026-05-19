import React from "react";

export function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
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
  return <section className={"rounded-3xl border border-slate-200 bg-white p-5 shadow-sm " + className}>{children}</section>;
}

export function ActionButton({ children, onClick, variant = "primary" }) {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
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
    <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{body}</p>
    </div>
  );
}
