# Handoff: ZenTask Dashboard + Kanban

## Overview
A task-management app with a left navigation panel, a default Dashboard view, and a drag-and-drop Kanban board. Tasks support sub-tasks and typed relationships to other tasks (blocks / blocked-by / related-to / duplicates). A modal-based New Task creation flow is reachable from every "New task" button in the app.

## About the design files
The files in `prototype/` are **design references created as an in-browser React + Babel HTML prototype** — they show intended look, layout, and behavior. They are **not production code to copy directly**.

Your task is to **recreate these designs in your project's existing environment** (React, Vue, SwiftUI, native, etc.) using your established patterns, state management, and libraries. If your project doesn't have an environment yet, pick whatever framework fits your stack (a modern Vite + React + TypeScript setup will most closely match the prototype).

## Fidelity
**High-fidelity.** Exact colors, typography, spacing, radii, and shadows are all defined in `prototype/design-system/colors_and_type.css` as CSS custom properties. Hover/focus states, animations, and easing are specified in the source files. Recreate pixel-perfectly using your codebase's existing component primitives where possible.

---

## Screens / Views

### 1. App Shell (`src/App.jsx`)
**Purpose:** Owns global state — active panel, theme, accent, sidebar collapse, open task, tasks store, and the new-task modal flag. Renders Sidebar + main area.

**Layout:**
- Full viewport flex row: Sidebar (244px, or 56px collapsed) + main column (flex 1)
- Main column: TopBar (52px height, sticky) + panel content
- `overflow: hidden` on the outer container; inner content scrolls

**Top bar:**
- Sidebar toggle (hamburger), breadcrumb ("Workspace › Dashboard" or "Product › Board name"), search field (sunken bg, ⌘K hint), theme toggle, notifications bell, user avatar

### 2. Sidebar (`src/Sidebar.jsx`)
**Purpose:** Top-level navigation between panels + board selection when Kanban is active.

**Layout (244px wide, full height):**
1. **Brand row** (52px): ZenTask logo (3-line slash mark) + wordmark
2. **Workspace switcher**: pill-style button — colored square avatar ("A") + "Acme Co." + chevron
3. **Primary nav** (PANELS list): Dashboard, Boards, My tasks, Inbox (badge: 3), Calendar, Reports, Search (⌘K)
4. **Contextual group:**
   - When `panel === 'kanban'`: shows **Boards** group with spaces (Product, Design, Engineering) and their boards nested
   - Otherwise: shows **Pinned** group with the first 2 boards
5. **Footer:** Members, Settings nav items + user row (avatar, name, email, overflow menu)

**Active nav item:** background `--bg-active`, icon color `--accent`, weight 600.
**Hover:** background `--bg-hover`.
**Badge:** soft accent background, accent-fg color, pill shape.

### 3. Dashboard panel (`src/Dashboard.jsx`)
**Purpose:** Default landing view — personal + team signals at a glance.

**Layout:** Vertical stack inside a scroll container with `padding: 20px 28px 40px`.

1. **DashHeader** — flex row, baseline-aligned:
   - Left: small uppercase date · large `Good morning, June.` (30px / 700 / -0.025em) · sub-copy with bold counts
   - Right: "This week" filter button + primary "New task" button
2. **Stat row** — 4-column grid (`gap: 14px`):
   - Tasks due this week (accent), In progress (info), Awaiting review (warning), Completed this quarter (success)
   - Each card: label · 26x26 colored icon chip · big number (28px / 700 / tnum) · delta with arrow icon
3. **Main grid** — 3 columns `minmax(0, 1.05fr) minmax(0, 1.25fr) minmax(0, 0.9fr)`, `gap: 16px`:
   - **Left:** QuickAdd, TodayTasks, FocusBlock
   - **Middle:** BoardSnapshot, MyTasksBlock
   - **Right:** UpcomingDeadlines, Activity, TeamWorkload

**QuickAdd:** elevated card with plus-icon chip + input + "N" keyboard hint + filter chips row (board, assignee, priority, date) below a hairline divider.

**TaskRow** (used in TodayTasks, MyTasksBlock):
- Round complete-toggle (18px) · PriorityIcon bars · title + meta row (ID · StatusBadge) · AvatarStack (max 2, size 20)
- Hover: `--bg-hover` + 8px border-radius
- When toggled done: line-through + muted color

**FocusBlock:** elevated card with a radial-gradient accent overlay in the top-right corner; 36x36 accent-bg icon chip + heading + body + two buttons (Start focus / Snooze).

**BoardSnapshot:** Header with subtitle "Product · 14 tasks" and "Open board" action. Then:
- **Distribution bar:** 8px tall, full-width, segmented per column (`backlog`=neutral-300, `in_progress`=info, `in_review`=warning, `done`=success)
- **Mini-columns grid:** 4 columns, each is a sunken card with dot+name+count header and up to 3 mini-cards (elevated, 6/7 radius, font 11/lineheight 1.3, 2-line clamp)

**UpcomingDeadlines:** rows of `[date-chip, task title + ID, assignee avatar]`. DueChip is a 38px wide block showing month above day. Overdue uses `--danger-soft` bg and danger fg.

**Activity:** vertical list with avatar + verb sentence ("**June Lee** moved Pricing → In review") + optional quoted comment block + "12m ago".

**TeamWorkload:** per-member row: avatar + name + thin progress bar (4px) + count. Bar uses `--accent`, switches to `--warning` once `>=85%`.

### 4. Kanban Board (`src/Board.jsx`)
**Purpose:** Four-column drag-and-drop board for one selected board's tasks.

**Above the board: BoardToolbar (`App.jsx`)** — segmented Board/Timeline/Calendar tabs, Filter + Group:Status buttons, AvatarStack (team), primary "New task" button.

**Board layout:**
- Horizontal scroller, gap responds to density tweak (10 / 12 / 16px)
- Four columns: Backlog · In progress · In review · Done · plus "+ Add column" dashed placeholder
- Column width also density-responsive (268 / 304 / 320px)

**Column:**
- Sunken bg, 16px radius, 8px padding
- Header: status dot · name · count (mono small) · plus & more icons
- Drop target: outline transitions to `--accent` on `dragover`
- Card list inside scrollable area

**TaskCard:**
- Elevated bg, 12px radius, 1px border (turns `--accent` when open)
- Urgent (priority ≥ 4): vertical red strip on the left edge
- Header row: ID (mono) + Tags (right)
- Title: 13.5 / 600 / -0.005em / line-height 1.35
- Footer: PriorityIcon · due-date (danger color when "Today" / "Yesterday") · comments count · AvatarStack
- `draggable={true}`; on `dragstart` writes task id to `e.dataTransfer`; column on `drop` calls `onMoveTask(id, colId)`

### 5. Task Detail panel (`src/TaskDetail.jsx`)
**Purpose:** Right-side overlay revealing full task info. Triggered by clicking a card.

**Layout:**
- Scrim: `position: absolute`, fades in over board, `--bg-inverse` at 30% alpha + 2px blur
- Panel: 480px wide, right-aligned, full-height, `--bg-elevated`, slides in from right (240ms ease-out)
- Header: ID · separator · StatusBadge · spacer · link/more/x icon buttons
- Body (scrollable): big title · property rows (Status, Assignees, Priority, Due, Labels) · **Sub-tasks** · **Relations** · Description · Activity
- Footer: avatar + comment input + Comment button

**DetailRow:** label (90px col, muted, 12px / 500) + value control. Pick controls have a sunken bg, 1px border, 8px radius, 200px min-width.

**Sub-tasks section** (new):
- Header: "SUB-TASKS" eyebrow + "done/total" mono counter + "+ Add" button
- Thin 3px progress bar
- Each row: square check (16px, 4px radius, accent when done) + title (strike-through when done) + assignee avatar
- Inline add row with autofocus input — Enter to commit, Esc to cancel

**Relations section** (new):
- Header: "RELATIONS" eyebrow + count + "+ Link" button (opens a dropdown menu of kinds, then a search-by-id picker)
- Groups by kind (`Blocks → / Blocked by ← / Related to ↔ / Duplicates ≡`), each group header shows arrow glyph in kind's color (danger / warning / info / muted) + uppercase eyebrow label
- Each linked-task card: ID (mono) · title (ellipsised) · StatusBadge · remove × button. Whole card is click-to-open.
- Empty state: a row of 4 pill buttons, one per kind, that jump straight to the picker

### 6. New Task Modal (`src/NewTaskModal.jsx`)
**Purpose:** Centered modal for creating tasks. Opens from every "New task" button (Dashboard header, Board toolbar) and is the only task-creation path.

**Layout:**
- Fixed full-viewport overlay, `padding-top: 80px`
- Scrim: blurred (4px) `--bg-inverse` at 40% alpha
- Dialog: 640px max-width, 16px radius, elevated bg, scale-in animation (220ms)
- Header: accent plus-chip + "New task" + "Press ⌘+↵ to create" hint + close button
- Body (scrollable):
   - Title input (20px / 600 / -0.02em)
   - Description textarea (3 rows, resize-vertical)
   - Property grid (2 cols: label + control), each label has a small icon and gray text:
     - Board → native select bound to `BOARDS`
     - Status → pill row (one pill per column, dot + name)
     - Priority → pill row with PriorityIcon + label
     - Assignees → multi-select chips (avatar + name)
     - Due → preset pills (Today / Tomorrow / This week / Next week) + free-text input
     - Labels → toggleable Tag pills
     - Linked to → "+ Link to a task" button → inline picker (kind selector + search + result list)
- Footer (sunken bg): live "Will appear in **{Board}** · **{Column}**" hint + Cancel + primary Create button

**Behaviour:**
- Esc closes; ⌘/Ctrl+Enter creates
- Title autofocuses on open
- All fields reset on open
- Create button disabled until title is non-empty
- On create: new task is unshifted into `TASKS[boardId]`, app switches to Kanban panel + opens the new task in the detail overlay

### 7. Stub panels (`src/Stubs.jsx`)
My tasks · Inbox · Calendar · Reports · Members · Settings each render the same empty-state card (icon chip + headline + body + CTA pair) inside the same page chrome (h1 + Filter/New buttons). Use as placeholders until you implement them.

### 8. Tweaks panel (`src/App.jsx` → `Tweaks`)
A floating dev panel (top-right) for switching:
- Theme: Light / Dark (writes `data-theme` on `<html>`)
- Accent: Sage / Indigo / Coral / Amber (overrides `--accent`, `--accent-soft`, `--btn-primary-bg`, `--shadow-focus`, etc.)
- Card density: Airy / Balanced / Dense (affects Board column width, gap, and card padding)

**Note:** The Tweaks system is a prototype-only design aide. You do not need to ship it. Pick one accent + theme combo for your production default.

---

## Interactions & Behavior

| Trigger | Behavior |
|---|---|
| Click sidebar item | Switches active panel; Boards group expands when "Boards" is active |
| Click board in sidebar | Switches to Kanban panel + sets that board active |
| Click "New task" anywhere | Opens NewTaskModal |
| ⌘+Enter inside modal | Creates task; closes modal; opens task detail |
| Esc inside modal | Cancels |
| Drag card into another column | Calls `onMoveTask(id, columnId)`; column outlines in accent on dragover |
| Click card | Opens TaskDetail panel; clicking same card again closes it |
| Click linked task in Relations | Switches detail to that task |
| Click sub-task checkbox | Toggles done; updates progress bar |
| Inline "Add sub-task" Enter | Creates sub-task; clears input |
| Click "+ Link" → kind → search → result | Adds relation of that kind |
| Click × on a relation | Removes the link |
| Tweaks toggle (toolbar) | Shows/hides the Tweaks panel |
| Theme toggle (top bar) | Flips between light + dark |

**Animations / motion**
- Modal scale-in: 220ms, ease-out, from `translateY(-8px) scale(0.985)`
- Detail panel slide-in: 240ms, ease-out, from `translateX(20px)`
- Scrim fade: 160–200ms
- Hover transitions on cards/buttons: 120–160ms ease-out
- Progress bar width: 240–360ms ease-out

---

## State Management

State is held entirely in `App.jsx` via `useState`:

```
theme            : 'light' | 'dark'                  (Tweak)
accent           : 'sage' | 'indigo' | 'coral' | 'amber' (Tweak)
density          : 'airy' | 'balanced' | 'dense'    (Tweak)
panel            : 'dashboard' | 'kanban' | 'mytasks' | 'inbox' | 'calendar' | 'reports' | 'members' | 'settings'
boardId          : string  (one of BOARDS[].id)
collapsed        : boolean (sidebar)
openTaskId       : string | null
newTaskOpen      : boolean
tasks            : Task[]  (current board's tasks, mutable for DnD)
```

**Mutators that should map to API calls in production:**
- `moveTask(id, columnId)` → PATCH /tasks/:id { columnId }
- `updateTask(task)` → PATCH /tasks/:id (used for sub-task add/toggle + link add/remove)
- `createTask(task, boardId)` → POST /boards/:boardId/tasks
- Sub-task toggle currently mutates the in-memory `SUBTASKS` map; in production this is a child task with its own row

**Data shape (see `src/data.jsx`):**
```ts
type Task = {
  id: string;
  col: 'backlog' | 'in_progress' | 'in_review' | 'done';
  title: string;
  tags: string[];          // see TAG_HUE for canonical labels
  priority: 1 | 2 | 3 | 4; // Low / Medium / High / Urgent
  due: string | null;      // "Today" | "May 22" | "Jun 03" | ...
  assignees: string[];     // PEOPLE keys
  comments: number;
  children?: string[];     // SUBTASKS keys
  links?: { kind: 'blocks' | 'blocked_by' | 'related' | 'duplicates'; id: string }[];
};

type Subtask = {
  id: string;
  parent: string;
  title: string;
  done: boolean;
  assignee: string;
};
```

---

## Design Tokens

All tokens live in `prototype/design-system/colors_and_type.css` and are referenced as CSS custom properties throughout. Bring this file into your codebase (or transpose to your token system).

Highlights:
- **Accent:** `--accent` (default `oklch(58% 0.095 172)`, sage). Soft pair: `--accent-soft` / `--accent-soft-fg`.
- **Surfaces:** `--bg`, `--bg-elevated`, `--bg-sunken`, `--bg-hover`, `--bg-active`
- **Foreground:** `--fg`, `--fg-muted`, `--fg-subtle`, `--fg-faint`, `--fg-on-accent`
- **Borders:** `--border-subtle`, `--border`, `--border-strong`, `--border-focus`
- **Status:** `--info`, `--warning`, `--success`, `--danger` + their `-soft` pairs
- **Radii:** components use 6 (chips), 8 (buttons/inputs), 10 (small surfaces), 12 (cards), 14 (panels), 16 (board columns / modal)
- **Shadows:** `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-focus`
- **Type:** `--font-sans` (UI), `--font-mono` (IDs, badges, kbd hints)
- **Easing:** `--ease-out` is the global motion curve
- **Theme:** `data-theme="dark"` on `<html>` flips every token; nothing else needs to change

---

## Files

In `prototype/`:

| File | Role |
|---|---|
| `ZenTask Dashboard.html` | Entry point — loads React + Babel + all scripts in order |
| `design-system/colors_and_type.css` | All CSS variables (light + dark theme) |
| `src/App.jsx` | Shell, state, panel routing, tweak wiring, board toolbar, top bar |
| `src/Sidebar.jsx` | Left navigation |
| `src/Dashboard.jsx` | Default landing view + all dashboard widgets |
| `src/Board.jsx` | Kanban board (drag-and-drop columns/cards) |
| `src/TaskDetail.jsx` | Right-side task detail overlay (incl. sub-tasks + relations) |
| `src/NewTaskModal.jsx` | New-task creation modal |
| `src/Stubs.jsx` | Empty-state stub panels for the other nav items |
| `src/components.jsx` | Shared atoms: Avatar, AvatarStack, Button, IconButton, StatusBadge, Tag, PriorityIcon |
| `src/icons.jsx` | Lucide-flavored inline-SVG icon set + `<Icon>` component |
| `src/data.jsx` | Seed data: people, spaces, boards, columns, tasks, sub-tasks, link kinds |
| `src/tweaks-panel.jsx` | Prototype-only Tweaks panel (skip in production) |

## How to run the prototype locally
Open `ZenTask Dashboard.html` in any browser, or serve the folder with any static HTTP server (e.g. `npx serve`). All compilation happens in-browser via Babel — no build step needed for the reference.

## How to recreate in your codebase
1. Drop `design-system/colors_and_type.css` into your styles entrypoint (or convert the variables to your token system).
2. Recreate the shared atoms in `components.jsx` using your component library (Button, Avatar, StatusBadge, etc.).
3. Build out the screens top-down: Sidebar → TopBar → Dashboard / Board / Modal / Detail.
4. Wire `moveTask` / `updateTask` / `createTask` to your real API.
5. Replace the in-memory `TASKS` / `SUBTASKS` with server data, ideally fetched per-board with optimistic updates for drag-and-drop.
6. The Tweaks panel is for prototyping only — drop it.
