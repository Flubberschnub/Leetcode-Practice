import React from "react";
import { Panel } from "./ui";

export function StatCard({ label, value, helper }) {
  return (
    <Panel className="min-h-[128px]">
      <p className="terminal-label">{label}</p>
      <p className="terminal-title mt-3 text-2xl">{value}</p>
      {helper ? <p className="theme-muted mt-2 text-sm">{helper}</p> : null}
    </Panel>
  );
}
