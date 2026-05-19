import React from "react";
import { Panel } from "./ui";

export function StatCard({ label, value, helper }) {
  return (
    <Panel className="min-h-[128px]">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
    </Panel>
  );
}
