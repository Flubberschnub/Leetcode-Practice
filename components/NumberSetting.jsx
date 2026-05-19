import React from "react";

export function NumberSetting({ label, value, onChange }) {
  return (
    <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="mb-2 block text-sm font-medium text-slate-800">{label}</span>
      <input
        type="number"
        min="0"
        max="10"
        value={value}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
      />
    </label>
  );
}
