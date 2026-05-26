# Handoff: ZenTask Boards — VS Code Extension

## Overview

This is a handoff for building a **Visual Studio Code extension** that surfaces the **Boards** experience from the ZenTask web app — specifically, the part where a user views tasks on a Kanban board.

The goal: a developer working inside VS Code can browse their ZenTask spaces and boards, open a board, see its columns and cards, drag a card between columns, open a task to read its details, and (eventually) jump from a `ZT-####` reference in their source code to the matching task. The extension is **read + light-write** scope — viewing, moving, opening, commenting. Creating boards/spaces and editing rich descriptions can stay in the web app.

## About the Design Files

The files in `reference/` are **design references built in HTML/JSX as a prototype** — they show the intended look and behavior of the Boards experience. They are *not* production code to copy verbatim.

Your job is to **recreate these designs as a real VS Code extension** using VS Code's official extension APIs and the host application's native UI surfaces (Activity Bar, Tree View, Webview, Quick Pick, Status Bar, Hover Provider, etc.). The HTML prototype renders the board inside a faux browser window; in VS Code, the same board will render inside a `WebviewPanel` and the surrounding chrome will be replaced by VS Code-native UI.

If your team already has a JavaScript/TypeScript SDK or REST client for ZenTask, wire the extension to that. If not, stub the data layer behind a single `ZenTaskClient` interface so it can be swapped later.

## Fidelity

**High-fidelity.** The web prototype is final-pixel for colors, typography, spacing, radii, shadows, animations, and component composition. Reproduce it faithfully **inside the webview**. Outside the webview (Tree View, Status Bar, hovers) you must use VS Code's theming tokens — don't try to override VS Code's native chrome with ZenTask colors. The brand expresses itself in the webview; the rest of the extension respects the user's VS Code theme.

---

## Extension Surfaces

The extension contributes the following surfaces to VS Code. Each maps to a chunk of the prototype.

### 1. Activity Bar contribution — "ZenTask"

- Add a custom view container to the Activity Bar with id `zentask`.
- Icon: the ZenTask "Z" mark, monochrome, 24×24, stroke-based (matches VS Code's native Activity Bar icon language). Use the SVG at `reference/design-system/assets/logo/mark.svg` if present, otherwise rebuild it as a 1.5px-stroke single-path "Z" that doubles back on itself.
- Activates the **Boards Tree View** in the side bar.

### 2. Tree View — "Boards"

Replaces the prototype's left **Sidebar.jsx**. Built with `vscode.TreeDataProvider<T>`, contributed in `package.json` under `views.zentask`.

**Hierarchy (3 levels):**

```
ZenTask (view title; shows current workspace name as the description)
├─ Product                      ← Space (collapsible)
│  ├─ Q2 Roadmap                ← Board (leaf — clicking opens the webview)
│  └─ Launch checklist
├─ Design
│  └─ Design System v2
└─ Engineering
   └─ Platform & Infra
```

**Per-node specs:**

- **Space node**: `TreeItem` with `collapsibleState: Collapsed` initially, `Expanded` once user opens it. `iconPath` is a small filled circle using the space's color (`var(--sage-500)` for Product, the per-space colors defined in `reference/src/data.jsx` `SPACES`). Use `ThemeIcon('circle-filled')` with a custom `color: new ThemeColor(...)` if you register your own theme colors, OR ship 6×6 SVGs.
- **Board node**: `TreeItem` with `iconPath: ThemeIcon('layout')` (VS Code's built-in Codicon that resembles a board). `command` property → `zentask.openBoard` with the board id as the argument. `contextValue: 'board'` so right-click can show actions.
- **Loading state**: while the client fetches, show a single child `TreeItem` with label "Loading…" and `iconPath: ThemeIcon('loading~spin')`.
- **Empty state**: contribute `viewsWelcome` with body "No boards yet. Sign in to ZenTask to see your spaces." and a button bound to `zentask.signIn`.

**View title actions** (toolbar icons on the view header):
- `zentask.refresh` → `ThemeIcon('refresh')`
- `zentask.search` → `ThemeIcon('search')` — opens a Quick Pick of all tasks across boards, filterable by title or `ZT-####` ID.

### 3. Webview Panel — "Board"

The main canvas. Opened by clicking a board in the tree (`zentask.openBoard` command). One panel per board; reuse the panel if the same board is reopened. `column: vscode.ViewColumn.Active` so it opens in the user's current editor group; users can drag it to a split.

**Tab title:** the board name (e.g. "Q2 Roadmap"). **Tab icon:** the same `layout` Codicon used in the tree.

**Inside the webview, recreate `reference/src/Board.jsx` 1:1:**
- Horizontal scrolling row of columns; each column is a `--bg-sunken` rounded surface, 304 px wide by default, 16 px radius, `padding: 8px`.
- Column header: 8 px colored dot (backlog → neutral-400, in_progress → info, in_review → warning, done → success), bold 13 px column name, monospace 11 px task count, and two trailing 14 px icon buttons (plus, more).
- Cards are `--bg-elevated` 12 px radius surfaces with 1 px `--border`, `--shadow-sm` resting / `--shadow-md` on hover. Hover **never scales**; only shadow + border-color change. 14/14/12 px padding (balanced density).
- Card content top-to-bottom:
  1. Monospaced task ID (`ZT-1142`, 11 px, `--fg-subtle`) on the left; tag chips on the right (10.5 px, colored backgrounds — see `TAG_HUE` map in `components.jsx`).
  2. Title — 13.5 px / weight 600 / line-height 1.35 / letter-spacing -0.005em.
  3. Footer row — left side: a 4-bar PriorityIcon (1–4), then due date with calendar icon (Today/Yesterday render in `--danger`), then comment count with message icon; right side: an AvatarStack capped at 3 with a `+N` overflow chip.
- Urgent priority (level 4) cards get a 3 px wide `--danger` accent strip on their left edge (12 px from top/bottom; rounded right corners).
- Trailing "Add column" placeholder column: dashed border, full column width, centered "+ Add column" label, fixed to `flex-start` so it doesn't stretch the row.
- Drag and drop: HTML5 DnD between columns. Drop target shows a 2 px `--accent` outline.

**Above the board** (header strip — see `reference/src/Dashboard.jsx` for the full header pattern, drop the parts that VS Code handles):
- Board name + a small space pill on the left.
- Filter chips (`Assignee`, `Label`, `Priority`, `Due`) and a sort/density control on the right.
- Drop the top app-bar avatar cluster and the global search — VS Code already provides command palette / search.

**Webview ↔ extension protocol** (use `acquireVsCodeApi()`):

| Message direction | Type | Payload |
|---|---|---|
| webview → ext | `task.move` | `{ id, fromCol, toCol }` |
| webview → ext | `task.open` | `{ id }` |
| webview → ext | `task.create` | `{ col, title }` |
| webview → ext | `comment.add` | `{ id, body }` |
| ext → webview | `board.load` | full board JSON (columns + tasks + people) |
| ext → webview | `board.patch` | partial update (e.g. another client moved a card) |

Persist the board's last scroll position in the panel's `state` (via `webview.postMessage` on visibility change) so reopening feels instant.

### 4. Task Detail — second Webview Panel (or sidebar)

Recreate `reference/src/TaskDetail.jsx` as a separate webview opened beside the board (`ViewColumn.Beside`). Same panel is reused for every task open. Keep the prototype's exact layout:
- Header: monospaced task ID, vertical divider, status pill, push-right `link / more / x` icon buttons.
- Title (22 px / weight 700 / line-height 1.25 / letter-spacing -0.018em).
- Detail rows: Status, Assignees (chips with avatars), Priority (4-bar icon + label), Due (calendar + label), Labels.
- Description block (eyebrow + paragraphs, 13.5 px / line-height 1.6).
- Sub-tasks section with a progress bar (3 px tall, `--accent` fill on `--bg-sunken` track) and inline add row.
- Relations section with grouped link chips (Blocks / Blocked by / Related to / Duplicates) — kind colors per `LINK_KINDS` in `data.jsx`.
- Activity feed with avatar + name + relative time, comment bubbles in `--bg-sunken`.
- Bottom composer: 26 px avatar, plain `--bg-sunken` input, primary "Comment" button.

The scrim/blur in the prototype does **not** apply in VS Code — the detail is its own panel, not an overlay.

### 5. Status Bar item

- Right-aligned status bar item: `$(layout) Q2 Roadmap · 4 in progress` (shows the active board name and a quick count). Clicking it focuses the board webview if open, otherwise reopens the last board.
- Hide the item when the user is signed out.

### 6. Hover provider — code references to tasks

Register a `HoverProvider` for all languages. When the cursor sits on a token matching `/\bZT-\d{3,6}\b/`, fetch the task and show a Markdown hover:

```
**ZT-1142** · In progress · High
Move login flow to OAuth provider
Assigned to June Lee · Due May 22
[Open in ZenTask](command:zentask.openTask?...)
```

Also register a `DocumentLinkProvider` so the same regex becomes a clickable link that fires `zentask.openTask`.

### 7. Commands (Command Palette)

Every user-facing action is a registered command so the palette + keybindings work:

| Command id | Title | Default keybinding |
|---|---|---|
| `zentask.openBoard` | ZenTask: Open Board… | — |
| `zentask.openTask` | ZenTask: Open Task… | `Ctrl+Alt+T` / `Cmd+Alt+T` |
| `zentask.search` | ZenTask: Search Tasks | `Ctrl+Alt+K` / `Cmd+Alt+K` |
| `zentask.createTask` | ZenTask: New Task | — |
| `zentask.refresh` | ZenTask: Refresh | — |
| `zentask.signIn` | ZenTask: Sign In | — |
| `zentask.signOut` | ZenTask: Sign Out | — |

---

## File / Project Layout (suggested)

```
zentask-vscode/
├─ package.json                 ← contributes views, commands, menus, keybindings
├─ src/
│  ├─ extension.ts              ← activate(), command registration
│  ├─ client/
│  │  ├─ ZenTaskClient.ts       ← interface — REST or stub
│  │  └─ types.ts               ← Task, Board, Space, Person, Column
│  ├─ tree/
│  │  ├─ BoardsTreeProvider.ts
│  │  └─ items.ts               ← SpaceItem, BoardItem
│  ├─ panels/
│  │  ├─ BoardPanel.ts          ← manages one WebviewPanel per board
│  │  └─ TaskPanel.ts           ← manages the task-detail panel
│  ├─ providers/
│  │  ├─ TaskHoverProvider.ts
│  │  └─ TaskLinkProvider.ts
│  ├─ status/
│  │  └─ BoardStatusItem.ts
│  └─ auth/
│     └─ session.ts
└─ webview/                     ← the React app that lives inside the webview
   ├─ index.html                ← bundled entry, loaded via asWebviewUri
   ├─ Board.tsx                 ← port of reference/src/Board.jsx
   ├─ TaskDetail.tsx            ← port of reference/src/TaskDetail.jsx
   ├─ components/               ← Avatar, AvatarStack, Tag, PriorityIcon, StatusBadge, Button, IconButton
   ├─ icons.tsx                 ← port of reference/src/icons.jsx
   └─ styles/
      └─ tokens.css             ← copy of colors_and_type.css
```

For the webview bundle, use Vite or esbuild. The webview must load assets via `webview.asWebviewUri(...)`; set the CSP header in the HTML.

---

## Design Tokens

All tokens are defined in `reference/design-system/colors_and_type.css`. **Copy that file verbatim** into `webview/styles/tokens.css` and import it as the first stylesheet in the webview HTML. The full token list (148 vars) is enumerated in the design system guide; only the ones referenced inside the webview are listed here.

### Colors used inside the board webview

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | warm off-white | warm near-black | Page background |
| `--bg-sunken` | one step darker | one step darker | Column body |
| `--bg-elevated` | white | one step lighter | Card surface, panels |
| `--bg-hover` | — | — | Hovered interactive surfaces |
| `--fg` | near-black | near-white | Body text |
| `--fg-muted` | mid neutral | mid neutral | Secondary text, icons |
| `--fg-subtle` | low-contrast | low-contrast | IDs, captions |
| `--border` | 1 px hairline | 1 px hairline | Card borders, dividers |
| `--border-strong` | 1 step darker | 1 step lighter | Hover state, dashed columns |
| `--border-subtle` | barely visible | barely visible | Internal dividers |
| `--accent` | sage 58% | sage shifted lighter | Primary actions, focus ring, urgent strip backdrop, progress fill |
| `--accent-soft` | sage 10% | sage 15% | Soft fills behind icons |
| `--info` / `--info-soft` | slate-blue / soft | shifted | In-progress dot, "Blocked by" link color |
| `--warning` / `--warning-soft` | amber / soft | shifted | In-review dot |
| `--success` / `--success-soft` | sage / soft | shifted | Done dot |
| `--danger` / `--danger-soft` | desaturated coral | shifted | Urgent strip, overdue dates, "Blocks" link color |

**Tag color map** — copy from `reference/src/components.jsx` (the `TAG_HUE` object): `bug` (coral), `design` (amber), `growth` (sage), `infra` (slate-blue), `research` (purple), `docs` (slate). 10.5 px text, 1px×7px padding, 4 px radius, weight 500.

### Type tokens

- `--font-sans: 'Manrope', system-ui, sans-serif;`
- `--font-mono: 'JetBrains Mono', ui-monospace, monospace;`
- `--font-serif:` (not used inside the webview — marketing only).
- Headings: letter-spacing -0.018em to -0.02em, line-height 1.1–1.35.
- Body: line-height 1.5.

### Spacing & radius

- 4 px grid. Use `--space-1` (4) through `--space-15` for everything.
- Card padding 16 px (balanced density), 12 px (dense), 20 px (settings panels).
- `--radius-md` 8 px (buttons, inputs, badges).
- `--radius-lg` 12 px (cards, menus).
- `--radius-xl` 16 px (columns).
- `--radius-pill` (status dots, avatars, chips).

### Shadows

- `--shadow-xs` resting hairline.
- `--shadow-sm` card resting.
- `--shadow-md` card hover, popovers.
- `--shadow-lg` menus.
- `--shadow-xl` task detail panel.
- `--shadow-focus` 3 px sage focus ring — never remove it.

### Motion

- `--ease-out: cubic-bezier(0.22, 1, 0.36, 1);` default for everything.
- `--ease-spring` reserved for the card-drop snap.
- Durations: `--dur-quick` 120 ms (hover), `--dur-base` 200 ms (default), `--dur-slow` 360 ms (modals, panels).
- Press transform: `scale(0.98)`, ~80 ms.

---

## Interaction Specs

### Drag and drop a card between columns

1. `dragstart` on a card — set `dataTransfer.setData('text/task-id', task.id)` and `effectAllowed = 'move'`.
2. `dragover` on a column — `preventDefault()`, set the column's `outline` to `2px solid var(--accent)` with `outlineOffset: -2`. Cursor: copy/move.
3. `drop` on a column — read `text/task-id`, post `task.move` to the extension host, optimistically update local state. On error from the host, revert.
4. Snap easing on drop uses `--ease-spring`, 240 ms.

### Open a task

1. Click card → post `task.open` with the task ID.
2. Extension host opens (or focuses) the TaskPanel webview in `ViewColumn.Beside` and posts `task.load` to it.
3. The card in the board gets `border: 1px solid var(--accent)` and `box-shadow: var(--shadow-md)` while open.
4. Closing the task panel notifies the board to clear that selection.

### Hover states

- Card hover: `box-shadow: var(--shadow-md)`, `border-color: var(--border-strong)`. **No scale.**
- Button hover: background steps to `--btn-primary-bg-hover` (primary) or `--bg-hover` (secondary/ghost).
- Icon button hover: background → `--bg-hover`, color → `--fg`.
- Link/text-link hover: color → `--accent`, underline appears 1 px offset.

### Press

- `transform: scale(0.98)`, ~80 ms. Apply to buttons and cards.

### Focus

- 3 px sage ring (`box-shadow: var(--shadow-focus)`) on every focusable element. **Don't remove the outline** — replace it with the ring.

### Density modes

The prototype's `density` prop offers `dense | balanced | airy`. Wire this to a setting `zentask.boardDensity` so VS Code users can pick their preference. Default `balanced`.

### Filters

The prototype has filter chips for Assignee/Label/Priority/Due. Each chip opens a Quick-Pick-style menu (built inside the webview, not VS Code's Quick Pick). Selected filters show count badges and persist per-board in `Memento` storage.

### Light vs dark

The webview must honor the user's VS Code color theme. Listen to `window.matchMedia('(prefers-color-scheme: dark)')` *and* the `body[data-vscode-theme-kind]` attribute VS Code stamps on the webview body. Map both `vscode-dark` and `vscode-high-contrast` to `data-theme="dark"` on the root.

---

## State, Persistence, Errors

### Local state

- **TreeView model** lives in the extension host. Refresh on `zentask.refresh` and on board-update events from the client.
- **Board model** lives in each `BoardPanel`. Hydrated from `board.load`. Mutations are optimistic; the extension host echoes back canonical state.
- **Filter + density** persisted in `context.globalState` keyed by board id.

### Auth

- Use VS Code's `authentication` API (`vscode.authentication.getSession`) with a custom provider for ZenTask OAuth. Cache the session; show a "Sign In" item in the tree view's welcome content when no session exists.

### Errors

- API failure on board load: webview shows an inline error card centered in the panel — `--bg-elevated`, 12 px radius, `--danger-soft` icon background, plain copy ("Couldn't load this board. Check your connection and try again."), and a `secondary` Button labelled "Retry". No emoji, no exclamation marks.
- API failure on mutate (move, comment): show a toast at the bottom-right of the webview — `--bg-elevated`, `--shadow-md`, 4 s auto-dismiss, with an "Undo" action when applicable.
- Network offline: status bar item flips to `$(cloud-offline) ZenTask offline` and uses `statusBarItem.backgroundColor = new ThemeColor('statusBarItem.warningBackground')`.

---

## Content / Voice (apply this verbatim — see the design system's "Content Fundamentals")

- **Sentence case everywhere.** "Add new task", "Move to Done", not Title Case.
- **No emoji.** Not in tooltips, not in commands, not in error messages.
- **No exclamation marks** in product UI.
- **Calm, factual confirmations.** "Saved." not "Saved! ✅". "1 task moved to Done." not "🎉 Nice work!".
- **Second person, singular.** "your boards", "you can drag".
- **Time:** `9:30 am`. **Dates:** `May 16` (compact), `May 16, 2026` (with year).

Specific strings the developer must write:

| Where | Copy |
|---|---|
| Tree view welcome (signed out) | "No boards yet. Sign in to ZenTask to see your spaces." |
| Tree view welcome — button | "Sign in" |
| Empty column placeholder | "Nothing here yet." |
| Loading state | "Loading…" |
| Board error | "Couldn't load this board. Check your connection and try again." |
| Move success toast | "1 task moved to {Column}." |
| Status bar (signed in) | `$(layout) {Board name} · {N} in progress` |
| Status bar (offline) | `$(cloud-offline) ZenTask offline` |
| Command palette titles | "ZenTask: …" prefix on every command |

---

## Iconography

Inside the webview, use **Lucide** icons (the design system's chosen set) — already inlined in `reference/src/icons.jsx`. Copy that file verbatim. 1.5 px stroke at 16/18 px, 2 px stroke at 24 px. Icons inherit `currentColor`.

Outside the webview (tree view, status bar, hovers), use **VS Code's built-in Codicons** via `new ThemeIcon('name')`. Suggested mapping:

| Where | Codicon |
|---|---|
| Board node | `layout` |
| Space node | `circle-filled` (themed via ThemeColor) |
| Refresh action | `refresh` |
| Search action | `search` |
| Status bar | `layout` / `cloud-offline` |
| Hover "Open" | `arrow-right` (in markdown link) |

---

## Out of Scope (do not build in v1)

- Creating boards or spaces (the web app stays the source of truth).
- Editing rich text descriptions (open the web app via "Open in browser").
- Real-time presence indicators on cards.
- Inline comment threads inside the board view (use the task panel).
- Settings, billing, or admin screens.

---

## Files in `reference/`

| File | What it is | What to port |
|---|---|---|
| `reference/ZenTask Dashboard.html` | The full prototype entry — open in any browser to see the live design. | Visual reference only. |
| `reference/design-system/colors_and_type.css` | All design tokens. | Copy verbatim into `webview/styles/tokens.css`. |
| `reference/src/Board.jsx` | Board + Column + TaskCard. The core of what you're building. | Port to `webview/Board.tsx`. |
| `reference/src/TaskDetail.jsx` | The right-side task panel. | Port to `webview/TaskDetail.tsx` as a second webview. |
| `reference/src/components.jsx` | Avatar, AvatarStack, Button, IconButton, StatusBadge, Tag, PriorityIcon. | Port to `webview/components/`. |
| `reference/src/icons.jsx` | The Lucide icon set used inside the webview. | Copy verbatim or swap to `lucide-react`. |
| `reference/src/data.jsx` | SPACES, BOARDS, COLUMNS, PEOPLE, TASKS, LINK_KINDS, SUBTASKS. | Use as the shape for your `types.ts` and as seed data for the stub client. |
| `reference/src/Sidebar.jsx` | The web app's left nav. | **Do not port** — VS Code Tree View replaces it. Reference for what space/board metadata is shown. |
| `reference/src/Dashboard.jsx` | The web app's overall shell + top bar + filter strip. | Port only the **filter strip / board header**. Drop the top app bar (VS Code's title bar replaces it). |
| `reference/src/NewTaskModal.jsx` | The new-task modal. | Optional — VS Code's `InputBox` is a fine v1 substitute. |
| `reference/src/App.jsx`, `Stubs.jsx`, `tweaks-panel.jsx` | Prototype-only scaffolding. | Do not port. |

---

## Acceptance Checklist

A finished v1 of this extension should pass every item:

- [ ] Activity Bar icon installs ZenTask alongside Explorer / Search / Source Control.
- [ ] Boards tree view shows spaces (with colored dots) and boards (with `layout` icons).
- [ ] Clicking a board opens a webview tab whose title is the board name.
- [ ] Inside the webview, columns, cards, IDs, tags, priority bars, due dates, avatars all match the prototype pixel-for-pixel.
- [ ] Dragging a card to another column animates the drop with the spring easing and syncs to the backend.
- [ ] Clicking a card opens the Task Detail webview to the right.
- [ ] Detail panel renders ID, status pill, title, all detail rows, description, sub-tasks progress, relations, activity, and the comment composer.
- [ ] Hovering `ZT-####` in any source file shows the task summary; clicking opens it in the extension.
- [ ] Status bar item shows the active board and in-progress count.
- [ ] Light and dark VS Code themes both produce a correctly themed webview.
- [ ] Command palette exposes all `ZenTask: …` commands.
- [ ] No emoji or exclamation marks appear in any extension-owned string.
- [ ] Focus rings are visible on every focusable element inside the webview.
