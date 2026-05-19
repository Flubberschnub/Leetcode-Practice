import React from "react";

export function NumberSetting({ label, value, onChange }) {
  return (
    <label className="terminal-card block p-4">
      <span className="terminal-label mb-2 block">{label}</span>
      <input
        type="number"
        min="0"
        max="10"
        value={value}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="theme-input w-full border px-3 py-2 font-bold outline-none"
      />
    </label>
  );
}
