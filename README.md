# LeetCode Review Planner

A local-first React app for planning LeetCode practice around algorithm patterns, spaced review, and the NeetCode 150 problem set.

The planner gives you a small lesson when you are ready to practice. A lesson contains new problems from the current pattern track plus review problems that are due based on previous solve results. After each problem, log whether you solved it solo, used a hint, or needed the solution.

## Features

- Lesson-based planning instead of calendar-based planning
- Configurable mix of new problems and reviews
- Spaced review scheduling by future lesson count
- NeetCode 150 problem library with NeetCode links
- Review backlog ordered by urgency and mastery
- Searchable problem library
- JSON export/import for portable progress
- Browser localStorage autosave
- Configurable theme base and accent color
- Matrix-style cyberpunk terminal UI with animated scanlines

## Run Locally

Install Node.js LTS first:

```text
https://nodejs.org/
```

Then from this project folder:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Production build:

```powershell
npm run build
```

Preview production build:

```powershell
npm run preview
```

## Run With Docker

Build the production image:

```powershell
docker build -t leetcode-review-planner .
```

Run it on port `8080`:

```powershell
docker run --rm -p 8080:80 leetcode-review-planner
```

Then open:

```text
http://localhost:8080
```

The container serves the Vite production build with nginx. Progress is still stored in the browser that opens the app, so rebuilding or restarting the container does not erase browser-local progress.

## How Lessons Work

The app does not automatically generate a new plan every calendar day. Instead, click `Start lesson` when you are actually ready to practice.

By default each lesson targets:

- `3` total problems
- `2` new problems
- `1` review problem

Reviews are scheduled by lesson count. For example, if a problem is due at lesson `7`, it appears when you start lesson `7` or later.

Solve results affect the next review:

- `solo`: longer interval and higher mastery gain
- `hint`: shorter interval and smaller mastery gain
- `solution`: quick review and mastery penalty

Completed problems in the active lesson are visually dimmed and locked so you do not accidentally log them twice.

## Storage

Progress autosaves in browser `localStorage` under:

```text
leetcode-review-planner-v2
```

This survives refreshes, browser restarts, and dev server restarts on the same browser profile.

For portability, use Settings:

- `Export JSON` downloads your current progress
- `Import JSON` restores progress from a file

The import path merges saved progress against the current problem library so future library/link updates are less likely to break old saves.

## Project Structure

```text
components/
  DailyProblemCard.jsx      Active lesson problem row
  NumberSetting.jsx         Numeric settings input
  PatternSignalMap.jsx      Pattern sequence display
  PlannerPanels.jsx         Lesson, backlog, library, settings panels
  StatCard.jsx              Status readouts
  ui.jsx                    Shared UI primitives

data/
  neetcode150.js            NeetCode 150 problem library and URL mapping

planner/
  constants.js              Defaults, pattern order, review settings
  scheduler.js              Lesson generation and spaced review logic
  theme.js                  Theme variables and accent colors

state/
  storage.js                localStorage and JSON import/export helpers

utils/
  date.js                   Date helpers for exports and attempt logs

src/
  main.jsx                  Vite entrypoint
  styles.css                Tailwind imports and custom terminal UI styles
```

## Notes

This app does not submit solutions or sync solve history to a server. NeetCode progress is handled by opening each problem on NeetCode and solving/submitting there.
