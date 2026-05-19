import React from "react";
import { Panel } from "./ui";

export function StatCard({ label, value, helper }) {
  return (
    <Panel className="min-h-[128px]">
      <p className="theme-muted text-sm">{label}</p>
      <p className="theme-strong mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {helper ? <p className="theme-muted mt-2 text-sm">{helper}</p> : null}
    </Panel>
  );
}
