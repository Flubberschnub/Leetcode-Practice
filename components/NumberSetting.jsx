import React from "react";

export function NumberSetting({ label, value, onChange }) {
  return (
    <label className="theme-subtle rounded-2xl border p-4">
      <span className="theme-strong mb-2 block text-sm font-medium">{label}</span>
      <input
        type="number"
        min="0"
        max="10"
        value={value}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="theme-input w-full rounded-2xl border px-3 py-2 outline-none"
      />
    </label>
  );
}
