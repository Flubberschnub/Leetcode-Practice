# LeetCode Review Planner

LeetCode Review Planner is a local web app for building a steady algorithm practice habit. It creates short practice lessons from the NeetCode 150 problem set, groups new problems by algorithm pattern, and brings old problems back for review before you forget them.

The core workflow is simple:

1. Pick the algorithm pattern you want to focus on, such as Arrays & Hashing, Sliding Window, Trees, Graphs, or Dynamic Programming.
2. Start a lesson.
3. Solve each assigned problem on NeetCode.
4. Log how the solve went: `solo`, `hint`, `solution`, or `skip`.
5. Let the app schedule future reviews based on how well you remembered the problem.

The app is local-first. Your progress is stored in your browser and can be exported as a JSON file when you want a backup or want to move to another machine.

## Screenshots

![Lesson terminal view](Screenshots/Screenshot%202026-05-19%20183401.png)

![Pattern map and planner controls](Screenshots/Screenshot%202026-05-19%20183459.png)

## What It Does

- Builds small practice lessons from the NeetCode 150 problem set
- Teaches by algorithm pattern so you can internalize common problem-solving templates
- Mixes new problems with review problems from your previous lessons
- Schedules reviews by future lesson count, not by strict calendar dates
- Tracks whether each solve was done solo, with a hint, or with the solution
- Lets you skip a problem in the current lesson without changing that problem's history
- Links each problem to its NeetCode page so your NeetCode account can track submissions
- Provides a searchable library of all included problems
- Lets you click the pattern map to choose the topic for your next lesson
- Exports and imports progress as JSON
- Uses a Matrix-inspired terminal interface with configurable theme colors

## How Lessons Work

A lesson is a short practice session. By default, each lesson contains:

- `3` total problems
- `2` new problems from the selected pattern
- `1` review problem from your backlog, when one is due

You can change those numbers in Settings.

Reviews are scheduled by lesson number. For example, if a problem is due on lesson `7`, it will appear once you start lesson `7` or any later lesson. This keeps the app flexible if you practice irregularly.

Your result changes the next review interval:

- `solo`: you remembered it well, so the next review is farther away
- `hint`: you were close, so the next review is sooner
- `solution`: you needed to relearn it, so the next review comes back quickly
- `skip`: the problem is removed from the current lesson only; mastery and review schedule are unchanged

Completed and skipped problems are dimmed and locked in the active lesson so they are not logged twice.

## Pattern Selection

The pattern signal map shows every NeetCode 150 topic included in the app. Click any pattern to route the next lesson's new problems to that topic.

Changing the selected pattern does not erase previous work. Review problems still come from the same global backlog, regardless of which new-problem pattern you choose.

## Storage And Backups

Progress is saved automatically in browser `localStorage` under:

```text
leetcode-review-planner-v2
```

This means progress survives refreshes, browser restarts, and dev server restarts in the same browser profile.

Use Settings for portable backups:

- `Export JSON` downloads your current progress
- `Import JSON` restores progress from a file

The app does not send your solve history to a server.

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

## NeetCode Progress

This app does not submit code or sync directly with NeetCode. It opens each assigned problem on NeetCode, where you can solve and submit normally. Your planner history stays local; your submission history stays with NeetCode.
